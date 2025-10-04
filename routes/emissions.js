const express = require('express');
const jwt = require('jsonwebtoken');
const Emission = require('../models/Emission');
const Plant = require('../models/Plant');
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

// Get emissions data with filtering and pagination
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      plantId,
      startDate,
      endDate,
      page = 1,
      limit = 50,
      sortBy = 'timestamp',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (plantId) filter.plantId = plantId;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get emissions with pagination
    const emissions = await Emission.find(filter)
      .populate('plantId', 'name location plantType')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Emission.countDocuments(filter);

    res.json({
      emissions,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get emissions error:', error);
    res.status(500).json({ message: 'Server error fetching emissions data' });
  }
});

// Get real-time emissions data
router.get('/realtime', authenticateToken, async (req, res) => {
  try {
    const { plantId } = req.query;
    
    const filter = { plantId };
    const sort = { timestamp: -1 };
    const limit = 1;

    const latestEmission = await Emission.findOne(filter)
      .populate('plantId', 'name location plantType capacity')
      .sort(sort)
      .limit(limit);

    if (!latestEmission) {
      return res.status(404).json({ message: 'No emissions data found' });
    }

    res.json(latestEmission);
  } catch (error) {
    console.error('Get real-time emissions error:', error);
    res.status(500).json({ message: 'Server error fetching real-time data' });
  }
});

// Get emissions summary/analytics
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const {
      plantId,
      startDate,
      endDate,
      groupBy = 'day' // day, week, month, year
    } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const filter = { plantId };
    if (Object.keys(dateFilter).length > 0) {
      filter.timestamp = dateFilter;
    }

    // Get aggregated data
    const pipeline = [
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
          count: { $sum: 1 }
        }
      }
    ];

    const analytics = await Emission.aggregate(pipeline);

    // Get time series data
    const timeSeriesPipeline = [
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          co2: { $sum: '$emissions.co2.value' },
          power: { $sum: '$powerGeneration.value' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ];

    const timeSeries = await Emission.aggregate(timeSeriesPipeline);

    res.json({
      summary: analytics[0] || {},
      timeSeries,
      period: {
        start: startDate,
        end: endDate,
        groupBy
      }
    });
  } catch (error) {
    console.error('Get emissions analytics error:', error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
});

// Add new emission record
router.post('/', authenticateToken, async (req, res) => {
  try {
    const emissionData = {
      ...req.body,
      dataQuality: {
        ...req.body.dataQuality,
        source: req.body.dataQuality?.source || 'manual'
      }
    };

    const emission = new Emission(emissionData);
    await emission.save();

    // Populate plant data
    await emission.populate('plantId', 'name location plantType');

    res.status(201).json({
      message: 'Emission record created successfully',
      emission
    });
  } catch (error) {
    console.error('Create emission error:', error);
    res.status(500).json({ message: 'Server error creating emission record' });
  }
});

// Update emission record
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const emission = await Emission.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('plantId', 'name location plantType');

    if (!emission) {
      return res.status(404).json({ message: 'Emission record not found' });
    }

    res.json({
      message: 'Emission record updated successfully',
      emission
    });
  } catch (error) {
    console.error('Update emission error:', error);
    res.status(500).json({ message: 'Server error updating emission record' });
  }
});

// Delete emission record
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const emission = await Emission.findByIdAndDelete(id);
    if (!emission) {
      return res.status(404).json({ message: 'Emission record not found' });
    }

    res.json({ message: 'Emission record deleted successfully' });
  } catch (error) {
    console.error('Delete emission error:', error);
    res.status(500).json({ message: 'Server error deleting emission record' });
  }
});

// Get emission trends
router.get('/trends', authenticateToken, async (req, res) => {
  try {
    const {
      plantId,
      period = '30d', // 7d, 30d, 90d, 1y
      metric = 'co2' // co2, ch4, n2o, carbonIntensity, efficiency
    } = req.query;

    // Calculate date range based on period
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

    const filter = {
      plantId,
      timestamp: { $gte: startDate, $lte: now }
    };

    const trends = await Emission.find(filter)
      .select(`timestamp emissions.${metric} powerGeneration.value carbonIntensity efficiency.overall`)
      .sort({ timestamp: 1 });

    res.json({
      trends,
      period,
      metric,
      summary: {
        current: trends[trends.length - 1]?.[`emissions.${metric}`] || 0,
        previous: trends[trends.length - 2]?.[`emissions.${metric}`] || 0,
        change: trends.length > 1 ? 
          ((trends[trends.length - 1]?.[`emissions.${metric}`] || 0) - 
           (trends[trends.length - 2]?.[`emissions.${metric}`] || 0)) : 0
      }
    });
  } catch (error) {
    console.error('Get emission trends error:', error);
    res.status(500).json({ message: 'Server error fetching trends' });
  }
});

module.exports = router;
