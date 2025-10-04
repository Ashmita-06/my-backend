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

// Get cost reduction opportunities
router.get('/opportunities', authenticateToken, async (req, res) => {
  try {
    const { plantId, category, priority } = req.query;

    const filter = { plantId };
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    // Get cost reduction opportunities
    const opportunities = await getCostReductionOpportunities(plantId);

    // Filter based on query parameters
    let filteredOpportunities = opportunities;
    if (category) {
      filteredOpportunities = opportunities.filter(opp => opp.category === category);
    }
    if (priority) {
      filteredOpportunities = opportunities.filter(opp => opp.priority === priority);
    }

    res.json({
      opportunities: filteredOpportunities,
      summary: {
        total: opportunities.length,
        totalPotentialSavings: opportunities.reduce((sum, opp) => sum + opp.annualSavings, 0),
        averageROI: opportunities.reduce((sum, opp) => sum + opp.roi, 0) / opportunities.length,
        quickWins: opportunities.filter(opp => opp.implementationTime <= 6).length
      }
    });
  } catch (error) {
    console.error('Get cost reduction opportunities error:', error);
    res.status(500).json({ message: 'Server error fetching cost reduction opportunities' });
  }
});

// Get cost analysis for specific plant
router.get('/analysis', authenticateToken, async (req, res) => {
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
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get plant information
    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    // Get recent emissions data for cost analysis
    const emissions = await Emission.find({
      plantId,
      timestamp: { $gte: startDate }
    }).sort({ timestamp: -1 });

    // Calculate cost breakdown
    const costAnalysis = calculateCostBreakdown(plant, emissions);

    // Get optimization savings
    const optimizations = await Optimization.find({
      plantId,
      status: { $in: ['completed', 'in_progress'] }
    });

    const optimizationSavings = optimizations.reduce((sum, opt) => {
      return sum + (opt.improvements?.costSavings?.annual || 0);
    }, 0);

    res.json({
      plant: {
        id: plant._id,
        name: plant.name,
        type: plant.plantType,
        capacity: plant.capacity
      },
      period: {
        start: startDate,
        end: now,
        days: Math.ceil((now - startDate) / (1000 * 60 * 60 * 24))
      },
      costBreakdown: costAnalysis,
      optimizationSavings: {
        annual: optimizationSavings,
        implemented: optimizations.filter(opt => opt.status === 'completed').length,
        inProgress: optimizations.filter(opt => opt.status === 'in_progress').length
      },
      recommendations: generateCostReductionRecommendations(costAnalysis, plant)
    });
  } catch (error) {
    console.error('Cost analysis error:', error);
    res.status(500).json({ message: 'Server error performing cost analysis' });
  }
});

// Get fuel cost optimization
router.get('/fuel-optimization', authenticateToken, async (req, res) => {
  try {
    const { plantId } = req.query;

    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    // Get recent fuel consumption data
    const recentEmissions = await Emission.find({ plantId })
      .sort({ timestamp: -1 })
      .limit(100);

    const fuelAnalysis = analyzeFuelConsumption(plant, recentEmissions);

    res.json({
      plant: {
        id: plant._id,
        name: plant.name,
        fuelType: plant.fuelConsumption?.type
      },
      fuelAnalysis,
      optimizationStrategies: getFuelOptimizationStrategies(plant.plantType),
      marketInsights: getFuelMarketInsights(plant.fuelConsumption?.type)
    });
  } catch (error) {
    console.error('Fuel optimization error:', error);
    res.status(500).json({ message: 'Server error analyzing fuel optimization' });
  }
});

// Get maintenance cost optimization
router.get('/maintenance-optimization', authenticateToken, async (req, res) => {
  try {
    const { plantId } = req.query;

    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    // Get maintenance cost data (simulated)
    const maintenanceAnalysis = analyzeMaintenanceCosts(plant);

    res.json({
      plant: {
        id: plant._id,
        name: plant.name,
        age: calculatePlantAge(plant.commissioningDate)
      },
      maintenanceAnalysis,
      optimizationStrategies: getMaintenanceOptimizationStrategies(plant),
      predictiveMaintenance: getPredictiveMaintenanceRecommendations(plant)
    });
  } catch (error) {
    console.error('Maintenance optimization error:', error);
    res.status(500).json({ message: 'Server error analyzing maintenance optimization' });
  }
});

// Get carbon tax optimization
router.get('/carbon-tax-optimization', authenticateToken, async (req, res) => {
  try {
    const { plantId } = req.query;

    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    // Get recent emissions for carbon tax calculation
    const recentEmissions = await Emission.find({ plantId })
      .sort({ timestamp: -1 })
      .limit(100);

    const carbonTaxAnalysis = calculateCarbonTaxImpact(plant, recentEmissions);

    res.json({
      plant: {
        id: plant._id,
        name: plant.name,
        carbonIntensity: plant.carbonIntensity
      },
      carbonTaxAnalysis,
      reductionStrategies: getCarbonTaxReductionStrategies(plant),
      marketOpportunities: getCarbonMarketOpportunities(plant)
    });
  } catch (error) {
    console.error('Carbon tax optimization error:', error);
    res.status(500).json({ message: 'Server error analyzing carbon tax optimization' });
  }
});

// Helper functions
async function getCostReductionOpportunities(plantId) {
  const opportunities = [
    {
      id: 'fuel-optimization',
      title: 'Fuel Quality and Blending Optimization',
      category: 'fuel',
      priority: 'high',
      description: 'Optimize fuel quality and implement advanced blending strategies',
      annualSavings: 500000,
      investment: 200000,
      roi: 2.5,
      implementationTime: 3, // months
      risk: 'low',
      impact: {
        costReduction: 15,
        emissionReduction: 8,
        efficiencyGain: 5
      }
    },
    {
      id: 'efficiency-improvement',
      title: 'Boiler and Turbine Efficiency Upgrade',
      category: 'efficiency',
      priority: 'high',
      description: 'Implement advanced control systems and heat recovery',
      annualSavings: 800000,
      investment: 1500000,
      roi: 0.53,
      implementationTime: 8,
      risk: 'medium',
      impact: {
        costReduction: 20,
        emissionReduction: 15,
        efficiencyGain: 12
      }
    },
    {
      id: 'maintenance-optimization',
      title: 'Predictive Maintenance Implementation',
      category: 'maintenance',
      priority: 'medium',
      description: 'Implement AI-powered predictive maintenance system',
      annualSavings: 300000,
      investment: 500000,
      roi: 0.6,
      implementationTime: 6,
      risk: 'low',
      impact: {
        costReduction: 10,
        emissionReduction: 5,
        efficiencyGain: 3
      }
    },
    {
      id: 'carbon-capture',
      title: 'Carbon Capture and Utilization',
      category: 'emissions',
      priority: 'medium',
      description: 'Implement CCU technology for value-added products',
      annualSavings: 1200000,
      investment: 10000000,
      roi: 0.12,
      implementationTime: 18,
      risk: 'high',
      impact: {
        costReduction: 25,
        emissionReduction: 85,
        efficiencyGain: 0
      }
    },
    {
      id: 'waste-heat-recovery',
      title: 'Waste Heat Recovery System',
      category: 'efficiency',
      priority: 'medium',
      description: 'Install ORC system for waste heat utilization',
      annualSavings: 400000,
      investment: 2000000,
      roi: 0.2,
      implementationTime: 12,
      risk: 'medium',
      impact: {
        costReduction: 8,
        emissionReduction: 12,
        efficiencyGain: 8
      }
    }
  ];

  return opportunities;
}

function calculateCostBreakdown(plant, emissions) {
  // Simulate cost breakdown based on plant data
  const totalPower = emissions.reduce((sum, e) => sum + (e.powerGeneration?.value || 0), 0);
  const totalCO2 = emissions.reduce((sum, e) => sum + (e.emissions?.co2?.value || 0), 0);

  // Cost per MWh (simulated based on plant type)
  const costPerMWh = getCostPerMWh(plant.plantType);
  const totalCost = totalPower * costPerMWh;

  return {
    fuel: {
      amount: totalCost * 0.6, // 60% fuel costs
      percentage: 60,
      unit: 'USD'
    },
    operation: {
      amount: totalCost * 0.2, // 20% operations
      percentage: 20,
      unit: 'USD'
    },
    maintenance: {
      amount: totalCost * 0.15, // 15% maintenance
      percentage: 15,
      unit: 'USD'
    },
    carbonTax: {
      amount: (totalCO2 / 1000) * 50, // $50 per ton CO2
      percentage: 5,
      unit: 'USD'
    },
    total: {
      amount: totalCost,
      unit: 'USD'
    }
  };
}

function getCostPerMWh(plantType) {
  const costs = {
    coal: 45,
    natural_gas: 35,
    oil: 55,
    biomass: 40
  };
  return costs[plantType] || 45;
}

function generateCostReductionRecommendations(costAnalysis, plant) {
  const recommendations = [];

  if (costAnalysis.fuel.percentage > 50) {
    recommendations.push({
      type: 'fuel',
      priority: 'high',
      title: 'Optimize Fuel Costs',
      description: 'Fuel costs represent the largest expense. Consider fuel switching or quality optimization.',
      potentialSavings: costAnalysis.fuel.amount * 0.15,
      action: 'Implement fuel optimization strategies'
    });
  }

  if (costAnalysis.maintenance.percentage > 20) {
    recommendations.push({
      type: 'maintenance',
      priority: 'medium',
      title: 'Optimize Maintenance Costs',
      description: 'High maintenance costs detected. Consider predictive maintenance.',
      potentialSavings: costAnalysis.maintenance.amount * 0.2,
      action: 'Implement predictive maintenance system'
    });
  }

  if (costAnalysis.carbonTax.amount > 100000) {
    recommendations.push({
      type: 'emissions',
      priority: 'high',
      title: 'Reduce Carbon Tax Burden',
      description: 'High carbon tax costs. Implement emission reduction measures.',
      potentialSavings: costAnalysis.carbonTax.amount * 0.5,
      action: 'Implement carbon reduction strategies'
    });
  }

  return recommendations;
}

function analyzeFuelConsumption(plant, emissions) {
  const totalFuel = emissions.reduce((sum, e) => sum + (e.fuelConsumption?.amount || 0), 0);
  const totalPower = emissions.reduce((sum, e) => sum + (e.powerGeneration?.value || 0), 0);
  const fuelEfficiency = totalPower / totalFuel;

  return {
    totalFuel,
    totalPower,
    fuelEfficiency,
    averageConsumption: totalFuel / emissions.length,
    costPerUnit: getFuelCostPerUnit(plant.fuelConsumption?.type),
    optimizationPotential: calculateFuelOptimizationPotential(plant, fuelEfficiency)
  };
}

function getFuelCostPerUnit(fuelType) {
  const costs = {
    coal: 50, // USD per ton
    natural_gas: 3, // USD per MMBtu
    oil: 400, // USD per ton
    biomass: 30 // USD per ton
  };
  return costs[fuelType] || 50;
}

function calculateFuelOptimizationPotential(plant, currentEfficiency) {
  const benchmarkEfficiency = getBenchmarkEfficiency(plant.plantType);
  const improvementPotential = (benchmarkEfficiency - currentEfficiency) / currentEfficiency;
  
  return {
    currentEfficiency,
    benchmarkEfficiency,
    improvementPotential: Math.max(0, improvementPotential * 100),
    potentialSavings: improvementPotential * 1000000 // Simplified calculation
  };
}

function getBenchmarkEfficiency(plantType) {
  const benchmarks = {
    coal: 40,
    natural_gas: 55,
    oil: 45,
    biomass: 35
  };
  return benchmarks[plantType] || 40;
}

function getFuelOptimizationStrategies(plantType) {
  const strategies = {
    coal: [
      'Coal quality optimization and blending',
      'Advanced combustion control systems',
      'Coal preparation and sizing optimization',
      'Combustion air optimization'
    ],
    natural_gas: [
      'Combined cycle optimization',
      'Heat recovery steam generator tuning',
      'Gas turbine performance optimization',
      'Combined heat and power integration'
    ],
    oil: [
      'Fuel oil quality optimization',
      'Combustion system tuning',
      'Preheating optimization',
      'Atomization improvement'
    ]
  };
  return strategies[plantType] || strategies.coal;
}

function getFuelMarketInsights(fuelType) {
  return {
    currentPrice: getFuelCostPerUnit(fuelType),
    trend: 'stable',
    volatility: 'medium',
    recommendations: [
      'Consider long-term fuel contracts',
      'Monitor market prices for optimization opportunities',
      'Evaluate fuel switching options'
    ]
  };
}

function analyzeMaintenanceCosts(plant) {
  const plantAge = calculatePlantAge(plant.commissioningDate);
  const capacity = plant.capacity;
  
  // Simulate maintenance cost analysis
  const baseMaintenanceCost = capacity * 50; // $50 per MW per year
  const ageMultiplier = 1 + (plantAge * 0.02); // 2% increase per year
  const totalMaintenanceCost = baseMaintenanceCost * ageMultiplier;

  return {
    plantAge,
    totalMaintenanceCost,
    costPerMW: totalMaintenanceCost / capacity,
    ageMultiplier,
    breakdown: {
      preventive: totalMaintenanceCost * 0.4,
      corrective: totalMaintenanceCost * 0.35,
      predictive: totalMaintenanceCost * 0.15,
      emergency: totalMaintenanceCost * 0.1
    }
  };
}

function calculatePlantAge(commissioningDate) {
  if (!commissioningDate) return 0;
  const now = new Date();
  const commission = new Date(commissioningDate);
  return Math.floor((now - commission) / (1000 * 60 * 60 * 24 * 365));
}

function getMaintenanceOptimizationStrategies(plant) {
  const strategies = [
    'Implement predictive maintenance using IoT sensors',
    'Optimize maintenance scheduling based on load patterns',
    'Use condition-based maintenance instead of time-based',
    'Implement digital twin for maintenance optimization',
    'Optimize spare parts inventory management'
  ];

  if (calculatePlantAge(plant.commissioningDate) > 20) {
    strategies.push('Consider major component replacement planning');
    strategies.push('Implement life extension strategies');
  }

  return strategies;
}

function getPredictiveMaintenanceRecommendations(plant) {
  return {
    sensors: [
      'Vibration sensors on rotating equipment',
      'Temperature sensors on critical components',
      'Pressure sensors on steam systems',
      'Oil analysis sensors'
    ],
    aiModels: [
      'Failure prediction models',
      'Remaining useful life estimation',
      'Anomaly detection algorithms',
      'Maintenance scheduling optimization'
    ],
    benefits: {
      costReduction: 20,
      downtimeReduction: 30,
      efficiencyImprovement: 5
    }
  };
}

function calculateCarbonTaxImpact(plant, emissions) {
  const totalCO2 = emissions.reduce((sum, e) => sum + (e.emissions?.co2?.value || 0), 0);
  const carbonTaxRate = 50; // USD per ton CO2
  const totalCarbonTax = (totalCO2 / 1000) * carbonTaxRate;

  return {
    totalCO2,
    carbonTaxRate,
    totalCarbonTax,
    costPerMWh: totalCarbonTax / (emissions.reduce((sum, e) => sum + (e.powerGeneration?.value || 0), 0) || 1),
    reductionPotential: {
      technical: 0.3, // 30% technical reduction potential
      economic: 0.2, // 20% economic reduction potential
      total: 0.5 // 50% total reduction potential
    }
  };
}

function getCarbonTaxReductionStrategies(plant) {
  return [
    'Improve combustion efficiency',
    'Implement carbon capture and storage',
    'Switch to lower carbon fuels',
    'Optimize plant operations',
    'Implement waste heat recovery',
    'Use renewable energy integration'
  ];
}

function getCarbonMarketOpportunities(plant) {
  return {
    carbonCredits: {
      potential: 1000000, // USD per year
      requirements: 'Implement verified emission reduction projects'
    },
    carbonUtilization: {
      potential: 500000, // USD per year
      products: ['Methanol', 'Urea', 'Building materials', 'Fuels']
    },
    renewableIntegration: {
      potential: 200000, // USD per year
      options: ['Solar integration', 'Wind integration', 'Biomass co-firing']
    }
  };
}

module.exports = router;
