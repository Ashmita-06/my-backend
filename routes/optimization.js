const express = require('express');
const jwt = require('jsonwebtoken');
const Optimization = require('../models/Optimization');
const Plant = require('../models/Plant');
const Emission = require('../models/Emission');
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

// Get all optimization recommendations
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      plantId,
      type,
      status,
      priority,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};
    if (plantId) filter.plantId = plantId;
    if (type) filter.optimizationType = type;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const optimizations = await Optimization.find(filter)
      .populate('plantId', 'name location plantType capacity')
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Optimization.countDocuments(filter);

    res.json({
      optimizations,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get optimizations error:', error);
    res.status(500).json({ message: 'Server error fetching optimizations' });
  }
});

// Get optimization by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const optimization = await Optimization.findById(id)
      .populate('plantId', 'name location plantType capacity efficiency carbonIntensity')
      .populate('createdBy', 'name email organization')
      .populate('approvedBy', 'name email organization');

    if (!optimization) {
      return res.status(404).json({ message: 'Optimization not found' });
    }

    res.json(optimization);
  } catch (error) {
    console.error('Get optimization error:', error);
    res.status(500).json({ message: 'Server error fetching optimization' });
  }
});

// Create new optimization recommendation
router.post('/', authenticateToken, async (req, res) => {
  try {
    const optimizationData = {
      ...req.body,
      createdBy: req.user.userId
    };

    const optimization = new Optimization(optimizationData);
    await optimization.save();

    // Populate related data
    await optimization.populate('plantId', 'name location plantType');
    await optimization.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Optimization recommendation created successfully',
      optimization
    });
  } catch (error) {
    console.error('Create optimization error:', error);
    res.status(500).json({ message: 'Server error creating optimization' });
  }
});

// Update optimization
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const optimization = await Optimization.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('plantId', 'name location plantType')
    .populate('createdBy', 'name email')
    .populate('approvedBy', 'name email');

    if (!optimization) {
      return res.status(404).json({ message: 'Optimization not found' });
    }

    res.json({
      message: 'Optimization updated successfully',
      optimization
    });
  } catch (error) {
    console.error('Update optimization error:', error);
    res.status(500).json({ message: 'Server error updating optimization' });
  }
});

// Approve/reject optimization
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updateData = {
      status,
      approvedBy: req.user.userId
    };

    if (notes) {
      updateData.notes = notes;
    }

    const optimization = await Optimization.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
    .populate('plantId', 'name location plantType')
    .populate('createdBy', 'name email')
    .populate('approvedBy', 'name email');

    if (!optimization) {
      return res.status(404).json({ message: 'Optimization not found' });
    }

    res.json({
      message: `Optimization ${status} successfully`,
      optimization
    });
  } catch (error) {
    console.error('Update optimization status error:', error);
    res.status(500).json({ message: 'Server error updating optimization status' });
  }
});

// Get AI-generated optimization recommendations
router.post('/ai-recommendations', authenticateToken, async (req, res) => {
  try {
    const { plantId, currentEmissions, plantData } = req.body;

    // Get recent emissions data for the plant
    const recentEmissions = await Emission.find({ plantId })
      .sort({ timestamp: -1 })
      .limit(100);

    // Get plant information
    const plant = await Plant.findById(plantId);

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    // AI-powered analysis and recommendations
    const recommendations = await generateAIRecommendations(plant, recentEmissions);

    res.json({
      recommendations,
      plant: {
        id: plant._id,
        name: plant.name,
        type: plant.plantType,
        capacity: plant.capacity
      },
      analysisDate: new Date()
    });
  } catch (error) {
    console.error('AI recommendations error:', error);
    res.status(500).json({ message: 'Server error generating AI recommendations' });
  }
});

// Get optimization analytics
router.get('/analytics/summary', authenticateToken, async (req, res) => {
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

    const filter = { plantId, createdAt: { $gte: startDate } };

    // Get optimization statistics
    const stats = await Optimization.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          byType: {
            $push: {
              type: '$optimizationType',
              status: '$status',
              priority: '$priority'
            }
          },
          totalSavings: { $sum: '$improvements.costSavings.annual' },
          avgROI: { $avg: '$roi.benefitCostRatio' }
        }
      }
    ]);

    // Get status distribution
    const statusDistribution = await Optimization.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get type distribution
    const typeDistribution = await Optimization.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$optimizationType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      summary: stats[0] || {},
      statusDistribution,
      typeDistribution,
      period: {
        start: startDate,
        end: now,
        days: Math.ceil((now - startDate) / (1000 * 60 * 60 * 24))
      }
    });
  } catch (error) {
    console.error('Get optimization analytics error:', error);
    res.status(500).json({ message: 'Server error fetching optimization analytics' });
  }
});

// Helper function to generate AI recommendations
async function generateAIRecommendations(plant, emissions) {
  const recommendations = [];

  // Analyze current performance
  const avgEfficiency = emissions.reduce((sum, e) => sum + (e.efficiency?.overall || 0), 0) / emissions.length;
  const avgCarbonIntensity = emissions.reduce((sum, e) => sum + (e.carbonIntensity || 0), 0) / emissions.length;
  const totalCO2 = emissions.reduce((sum, e) => sum + (e.emissions?.co2?.value || 0), 0);

  // Recommendation 1: Efficiency improvements
  if (avgEfficiency < 40) {
    recommendations.push({
      type: 'efficiency_improvement',
      title: 'Boiler Efficiency Optimization',
      description: 'Implement advanced combustion control and heat recovery systems',
      potentialSavings: {
        emissionReduction: 15,
        costSavings: 500000,
        efficiencyGain: 8
      },
      implementation: {
        cost: 2000000,
        timeline: 6,
        complexity: 'medium',
        risk: 'low'
      },
      confidence: 85
    });
  }

  // Recommendation 2: Carbon capture
  if (totalCO2 > 1000000) { // More than 1M tons CO2
    recommendations.push({
      type: 'carbon_capture',
      title: 'Post-Combustion Carbon Capture',
      description: 'Install amine-based CO2 capture system with utilization',
      potentialSavings: {
        emissionReduction: 90,
        costSavings: 2000000,
        utilizationRevenue: 1500000
      },
      implementation: {
        cost: 15000000,
        timeline: 18,
        complexity: 'high',
        risk: 'medium'
      },
      confidence: 75
    });
  }

  // Recommendation 3: Fuel optimization
  if (plant.plantType === 'coal' && avgCarbonIntensity > 900) {
    recommendations.push({
      type: 'fuel_optimization',
      title: 'Coal Quality and Blending Optimization',
      description: 'Implement advanced coal blending and quality control',
      potentialSavings: {
        emissionReduction: 12,
        costSavings: 800000,
        efficiencyGain: 5
      },
      implementation: {
        cost: 1000000,
        timeline: 4,
        complexity: 'low',
        risk: 'low'
      },
      confidence: 90
    });
  }

  // Recommendation 4: Waste heat recovery
  recommendations.push({
    type: 'waste_heat_recovery',
    title: 'Waste Heat Recovery System',
    description: 'Install ORC system to recover waste heat for power generation',
    potentialSavings: {
      emissionReduction: 8,
      costSavings: 300000,
      efficiencyGain: 6
    },
    implementation: {
      cost: 3000000,
      timeline: 8,
      complexity: 'medium',
      risk: 'low'
    },
    confidence: 80
  });

  return recommendations;
}

module.exports = router;
