const mongoose = require('mongoose');

const optimizationSchema = new mongoose.Schema({
  plantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant',
    required: true
  },
  optimizationType: {
    type: String,
    enum: ['emission_reduction', 'cost_reduction', 'efficiency_improvement', 'carbon_capture', 'utilization'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  currentState: {
    emissions: {
      co2: Number,
      ch4: Number,
      n2o: Number,
      total: Number
    },
    costs: {
      fuel: Number,
      operation: Number,
      maintenance: Number,
      carbonTax: Number,
      total: Number
    },
    efficiency: {
      thermal: Number,
      electrical: Number,
      overall: Number
    }
  },
  proposedState: {
    emissions: {
      co2: Number,
      ch4: Number,
      n2o: Number,
      total: Number
    },
    costs: {
      fuel: Number,
      operation: Number,
      maintenance: Number,
      carbonTax: Number,
      total: Number
    },
    efficiency: {
      thermal: Number,
      electrical: Number,
      overall: Number
    }
  },
  improvements: {
    emissionReduction: {
      co2: Number, // percentage
      ch4: Number,
      n2o: Number,
      total: Number
    },
    costSavings: {
      annual: Number, // USD
      percentage: Number
    },
    efficiencyGain: {
      thermal: Number, // percentage
      electrical: Number,
      overall: Number
    }
  },
  implementation: {
    cost: {
      capital: Number, // USD
      operational: Number, // USD per year
      maintenance: Number, // USD per year
      total: Number
    },
    timeline: {
      planning: Number, // months
      implementation: Number, // months
      commissioning: Number, // months
      total: Number // months
    },
    complexity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true
    },
    risk: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true
    }
  },
  roi: {
    paybackPeriod: Number, // years
    netPresentValue: Number, // USD
    internalRateOfReturn: Number, // percentage
    benefitCostRatio: Number
  },
  carbonCapture: {
    technology: String,
    capacity: Number, // tons CO2 per year
    efficiency: Number, // percentage
    cost: Number, // USD per ton CO2
    utilization: {
      enabled: Boolean,
      products: [String],
      revenue: Number // USD per year
    }
  },
  utilization: {
    products: [{
      name: String,
      type: String,
      productionRate: Number,
      marketValue: Number,
      revenue: Number
    }],
    totalRevenue: Number,
    marketPotential: Number
  },
  status: {
    type: String,
    enum: ['proposed', 'under_review', 'approved', 'in_progress', 'completed', 'rejected'],
    default: 'proposed'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  aiRecommendation: {
    confidence: Number, // percentage
    reasoning: String,
    alternatives: [String],
    risks: [String],
    benefits: [String]
  },
  validation: {
    technical: {
      validated: Boolean,
      validator: String,
      date: Date,
      notes: String
    },
    financial: {
      validated: Boolean,
      validator: String,
      date: Date,
      notes: String
    },
    environmental: {
      validated: Boolean,
      validator: String,
      date: Date,
      notes: String
    }
  },
  results: {
    actualEmissionReduction: Number, // percentage
    actualCostSavings: Number, // USD
    actualEfficiencyGain: Number, // percentage
    lessonsLearned: String,
    recommendations: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [String],
  attachments: [{
    name: String,
    url: String,
    type: String
  }]
}, {
  timestamps: true
});

// Indexes for efficient queries
optimizationSchema.index({ plantId: 1, status: 1 });
optimizationSchema.index({ optimizationType: 1 });
optimizationSchema.index({ priority: 1, status: 1 });
optimizationSchema.index({ createdAt: -1 });

// Virtual for total savings
optimizationSchema.virtual('totalSavings').get(function() {
  return this.improvements.costSavings.annual + (this.utilization.totalRevenue || 0);
});

// Method to calculate ROI
optimizationSchema.methods.calculateROI = function() {
  const totalCost = this.implementation.cost.total;
  const annualSavings = this.improvements.costSavings.annual;
  
  if (totalCost > 0 && annualSavings > 0) {
    this.roi.paybackPeriod = totalCost / annualSavings;
    this.roi.benefitCostRatio = annualSavings / totalCost;
  }
  
  return this.roi;
};

module.exports = mongoose.model('Optimization', optimizationSchema);
