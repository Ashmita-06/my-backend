const express = require('express');
const jwt = require('jsonwebtoken');
const Emission = require('../models/Emission');
const Plant = require('../models/Plant');
const Optimization = require('../models/Optimization');
const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get comprehensive dashboard analytics
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const { plantId, period = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const filter = { plantId, timestamp: { $gte: startDate } };

    // Get emissions analytics
    const emissionsAnalytics = await Emission.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalCO2: { $sum: '$emissions.co2.value' },
          totalCH4: { $sum: '$emissions.ch4.value' },
          totalN2O: { $sum: '$emissions.n2o.value' },
          totalPower: { $sum: '$powerGeneration.value' },
          avgEfficiency: { $avg: '$efficiency.overall' },
          avgCarbonIntensity: { $avg: '$carbonIntensity' },
          maxEfficiency: { $max: '$efficiency.overall' },
          minCarbonIntensity: { $min: '$carbonIntensity' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get time series data for charts
    const timeSeries = await Emission.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          co2: { $sum: '$emissions.co2.value' },
          ch4: { $sum: '$emissions.ch4.value' },
          n2o: { $sum: '$emissions.n2o.value' },
          power: { $sum: '$powerGeneration.value' },
          efficiency: { $avg: '$efficiency.overall' },
          carbonIntensity: { $avg: '$carbonIntensity' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Get optimization analytics
    const optimizationFilter = { plantId, createdAt: { $gte: startDate } };
    const optimizationStats = await Optimization.aggregate([
      { $match: optimizationFilter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          implemented: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          totalSavings: { $sum: '$improvements.costSavings.annual' },
          avgROI: { $avg: '$roi.benefitCostRatio' }
        }
      }
    ]);

    // Get plant information
    const plant = await Plant.findById(plantId);

    // Calculate KPIs
    const kpis = calculateKPIs(emissionsAnalytics[0], optimizationStats[0], plant);

    res.json({
      period: {
        start: startDate,
        end: now,
        days: Math.ceil((now - startDate) / (1000 * 60 * 60 * 24))
      },
      plant: plant ? {
        id: plant._id,
        name: plant.name,
        type: plant.plantType,
        capacity: plant.capacity,
        efficiency: plant.efficiency
      } : null,
      emissions: emissionsAnalytics[0] || {},
      optimizations: optimizationStats[0] || {},
      timeSeries,
      kpis
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard analytics' });
  }
});

// Get emission trends and forecasting
router.get('/trends', authenticateToken, async (req, res) => {
  try {
    const { plantId, metric = 'co2', forecastDays = 30 } = req.query;

    // Get historical data
    const historicalData = await Emission.find({ plantId })
      .select(`timestamp emissions.${metric} powerGeneration.value carbonIntensity`)
      .sort({ timestamp: 1 })
      .limit(1000);

    if (historicalData.length === 0) {
      return res.json({
        historical: [],
        forecast: [],
        trends: {
          direction: 'stable',
          change: 0,
          confidence: 0
        }
      });
    }

    // Calculate trends
    const trends = calculateTrends(historicalData, metric);

    // Generate forecast (simplified linear regression)
    const forecast = generateForecast(historicalData, metric, parseInt(forecastDays));

    res.json({
      historical: historicalData.map(d => ({
        date: d.timestamp,
        value: d[`emissions.${metric}`] || 0,
        power: d.powerGeneration?.value || 0,
        carbonIntensity: d.carbonIntensity || 0
      })),
      forecast,
      trends,
      metric,
      forecastDays: parseInt(forecastDays)
    });
  } catch (error) {
    console.error('Trends analysis error:', error);
    res.status(500).json({ message: 'Server error analyzing trends' });
  }
});

// Get comparative analysis
router.get('/comparative', authenticateToken, async (req, res) => {
  try {
    const { plantId, benchmarkType = 'industry' } = req.query;

    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    // Get plant's recent performance
    const recentEmissions = await Emission.find({ plantId })
      .sort({ timestamp: -1 })
      .limit(100);

    const plantPerformance = calculatePlantPerformance(recentEmissions);

    // Industry benchmarks based on plant type
    const benchmarks = getIndustryBenchmarks(plant.plantType, plant.capacity);

    // Calculate performance vs benchmarks
    const comparison = {
      efficiency: {
        current: plantPerformance.avgEfficiency,
        benchmark: benchmarks.efficiency,
        performance: plantPerformance.avgEfficiency / benchmarks.efficiency * 100
      },
      carbonIntensity: {
        current: plantPerformance.avgCarbonIntensity,
        benchmark: benchmarks.carbonIntensity,
        performance: benchmarks.carbonIntensity / plantPerformance.avgCarbonIntensity * 100
      },
      availability: {
        current: plantPerformance.availability,
        benchmark: benchmarks.availability,
        performance: plantPerformance.availability / benchmarks.availability * 100
      }
    };

    res.json({
      plant: {
        id: plant._id,
        name: plant.name,
        type: plant.plantType,
        capacity: plant.capacity
      },
      performance: plantPerformance,
      benchmarks,
      comparison,
      recommendations: generateComparisonRecommendations(comparison)
    });
  } catch (error) {
    console.error('Comparative analysis error:', error);
    res.status(500).json({ message: 'Server error performing comparative analysis' });
  }
});

// Get cost-benefit analysis
router.get('/cost-benefit', authenticateToken, async (req, res) => {
  try {
    const { plantId, optimizationId } = req.query;

    if (optimizationId) {
      // Analyze specific optimization
      const optimization = await Optimization.findById(optimizationId)
        .populate('plantId', 'name capacity');

      if (!optimization) {
        return res.status(404).json({ message: 'Optimization not found' });
      }

      const analysis = {
        optimization: {
          id: optimization._id,
          title: optimization.title,
          type: optimization.optimizationType
        },
        costs: optimization.implementation.cost,
        benefits: {
          annualSavings: optimization.improvements.costSavings.annual,
          emissionReduction: optimization.improvements.emissionReduction.total,
          efficiencyGain: optimization.improvements.efficiencyGain.overall
        },
        roi: optimization.roi,
        paybackPeriod: optimization.roi.paybackPeriod,
        netPresentValue: calculateNPV(optimization),
        recommendation: getOptimizationRecommendation(optimization)
      };

      res.json(analysis);
    } else {
      // Analyze all optimizations for plant
      const optimizations = await Optimization.find({ plantId, status: { $in: ['proposed', 'approved', 'in_progress'] } });

      const analysis = {
        totalOptimizations: optimizations.length,
        totalInvestment: optimizations.reduce((sum, opt) => sum + opt.implementation.cost.total, 0),
        totalAnnualSavings: optimizations.reduce((sum, opt) => sum + opt.improvements.costSavings.annual, 0),
        averageROI: optimizations.reduce((sum, opt) => sum + opt.roi.benefitCostRatio, 0) / optimizations.length,
        optimizations: optimizations.map(opt => ({
          id: opt._id,
          title: opt.title,
          type: opt.optimizationType,
          investment: opt.implementation.cost.total,
          annualSavings: opt.improvements.costSavings.annual,
          roi: opt.roi.benefitCostRatio,
          paybackPeriod: opt.roi.paybackPeriod
        }))
      };

      res.json(analysis);
    }
  } catch (error) {
    console.error('Cost-benefit analysis error:', error);
    res.status(500).json({ message: 'Server error performing cost-benefit analysis' });
  }
});

// Helper functions
function calculateKPIs(emissions, optimizations, plant) {
  const kpis = {
    environmental: {
      totalCO2: emissions?.totalCO2 || 0,
      carbonIntensity: emissions?.avgCarbonIntensity || 0,
      efficiency: emissions?.avgEfficiency || 0,
      emissionReduction: 0 // Calculate based on optimizations
    },
    financial: {
      totalSavings: optimizations?.totalSavings || 0,
      averageROI: optimizations?.avgROI || 0,
      costPerMWh: 0 // Calculate based on costs
    },
    operational: {
      totalPower: emissions?.totalPower || 0,
      availability: 0, // Calculate based on operational hours
      performance: 0 // Calculate based on efficiency vs design
    }
  };

  return kpis;
}

function calculateTrends(data, metric) {
  if (data.length < 2) {
    return { direction: 'stable', change: 0, confidence: 0 };
  }

  const values = data.map(d => d[`emissions.${metric}`] || 0);
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));

  const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

  const change = ((secondAvg - firstAvg) / firstAvg) * 100;
  const direction = change > 5 ? 'increasing' : change < -5 ? 'decreasing' : 'stable';

  return {
    direction,
    change: Math.round(change * 100) / 100,
    confidence: Math.min(95, Math.max(60, 100 - Math.abs(change)))
  };
}

function generateForecast(data, metric, days) {
  if (data.length < 10) return [];

  const values = data.map(d => d[`emissions.${metric}`] || 0);
  const dates = data.map(d => new Date(d.timestamp));

  // Simple linear regression
  const n = values.length;
  const sumX = dates.reduce((sum, d) => sum + d.getTime(), 0);
  const sumY = values.reduce((sum, val) => sum + val, 0);
  const sumXY = dates.reduce((sum, d, i) => sum + d.getTime() * values[i], 0);
  const sumXX = dates.reduce((sum, d) => sum + d.getTime() * d.getTime(), 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const forecast = [];
  const lastDate = new Date(Math.max(...dates));
  
  for (let i = 1; i <= days; i++) {
    const forecastDate = new Date(lastDate.getTime() + i * 24 * 60 * 60 * 1000);
    const forecastValue = slope * forecastDate.getTime() + intercept;
    
    forecast.push({
      date: forecastDate,
      value: Math.max(0, forecastValue) // Ensure non-negative values
    });
  }

  return forecast;
}

function calculatePlantPerformance(emissions) {
  if (emissions.length === 0) {
    return {
      avgEfficiency: 0,
      avgCarbonIntensity: 0,
      availability: 0,
      totalCO2: 0,
      totalPower: 0
    };
  }

  const totalCO2 = emissions.reduce((sum, e) => sum + (e.emissions?.co2?.value || 0), 0);
  const totalPower = emissions.reduce((sum, e) => sum + (e.powerGeneration?.value || 0), 0);
  const avgEfficiency = emissions.reduce((sum, e) => sum + (e.efficiency?.overall || 0), 0) / emissions.length;
  const avgCarbonIntensity = emissions.reduce((sum, e) => sum + (e.carbonIntensity || 0), 0) / emissions.length;

  return {
    avgEfficiency,
    avgCarbonIntensity,
    availability: 95, // Simplified calculation
    totalCO2,
    totalPower
  };
}

function getIndustryBenchmarks(plantType, capacity) {
  const benchmarks = {
    coal: {
      efficiency: 35,
      carbonIntensity: 900,
      availability: 85
    },
    natural_gas: {
      efficiency: 50,
      carbonIntensity: 400,
      availability: 90
    },
    oil: {
      efficiency: 40,
      carbonIntensity: 700,
      availability: 88
    }
  };

  return benchmarks[plantType] || benchmarks.coal;
}

function generateComparisonRecommendations(comparison) {
  const recommendations = [];

  if (comparison.efficiency.performance < 90) {
    recommendations.push({
      type: 'efficiency',
      priority: 'high',
      title: 'Improve Thermal Efficiency',
      description: 'Current efficiency is below industry benchmark',
      action: 'Implement efficiency optimization measures'
    });
  }

  if (comparison.carbonIntensity.performance < 90) {
    recommendations.push({
      type: 'emissions',
      priority: 'high',
      title: 'Reduce Carbon Intensity',
      description: 'Carbon intensity exceeds industry benchmark',
      action: 'Implement emission reduction strategies'
    });
  }

  return recommendations;
}

function calculateNPV(optimization) {
  const investment = optimization.implementation.cost.total;
  const annualSavings = optimization.improvements.costSavings.annual;
  const discountRate = 0.08; // 8% discount rate
  const years = 20; // Project lifetime

  let npv = -investment;
  for (let year = 1; year <= years; year++) {
    npv += annualSavings / Math.pow(1 + discountRate, year);
  }

  return Math.round(npv);
}

function getOptimizationRecommendation(optimization) {
  const roi = optimization.roi.benefitCostRatio;
  const paybackPeriod = optimization.roi.paybackPeriod;

  if (roi > 2 && paybackPeriod < 3) {
    return 'Highly recommended - Excellent ROI and quick payback';
  } else if (roi > 1.5 && paybackPeriod < 5) {
    return 'Recommended - Good ROI and reasonable payback';
  } else if (roi > 1 && paybackPeriod < 7) {
    return 'Consider - Moderate ROI, evaluate other factors';
  } else {
    return 'Not recommended - Poor ROI or long payback period';
  }
}

module.exports = router;
