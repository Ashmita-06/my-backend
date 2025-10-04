const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  plantType: {
    type: String,
    enum: ['coal', 'natural_gas', 'oil', 'biomass', 'waste_to_energy'],
    required: true
  },
  capacity: {
    type: Number,
    required: true, // in MW
    min: 0
  },
  operationalStatus: {
    type: String,
    enum: ['operational', 'maintenance', 'shutdown', 'decommissioned'],
    default: 'operational'
  },
  commissioningDate: {
    type: Date
  },
  decommissioningDate: {
    type: Date
  },
  efficiency: {
    type: Number,
    min: 0,
    max: 100,
    default: 35 // Typical thermal plant efficiency
  },
  carbonIntensity: {
    type: Number, // kg CO2 per MWh
    default: 800
  },
  fuelConsumption: {
    type: {
      type: String,
      enum: ['coal', 'natural_gas', 'oil', 'biomass', 'mixed'],
      required: true
    },
    consumptionRate: Number, // tons/hour or cubic meters/hour
    calorificValue: Number // MJ/kg or MJ/m³
  },
  emissionFactors: {
    co2: Number, // kg CO2 per unit fuel
    ch4: Number, // kg CH4 per unit fuel
    n2o: Number  // kg N2O per unit fuel
  },
  controlTechnologies: [{
    name: String,
    type: {
      type: String,
      enum: ['scrubber', 'catalyst', 'filter', 'ccs', 'other']
    },
    efficiency: Number,
    installationDate: Date,
    status: {
      type: String,
      enum: ['active', 'maintenance', 'inactive'],
      default: 'active'
    }
  }],
  carbonCapture: {
    enabled: {
      type: Boolean,
      default: false
    },
    capacity: Number, // tons CO2 per year
    efficiency: Number, // percentage
    storageMethod: {
      type: String,
      enum: ['geological', 'enhanced_oil_recovery', 'industrial_use', 'other']
    }
  },
  utilization: {
    enabled: {
      type: Boolean,
      default: false
    },
    products: [{
      name: String,
      type: {
        type: String,
        enum: ['chemicals', 'fuels', 'materials', 'other']
      },
      productionRate: Number,
      marketValue: Number
    }]
  },
  financials: {
    operatingCost: Number, // per MWh
    maintenanceCost: Number, // per MWh
    carbonTax: Number, // per ton CO2
    revenue: Number // per MWh
  }
}, {
  timestamps: true
});

// Index for efficient queries
plantSchema.index({ location: 1 });
plantSchema.index({ plantType: 1 });
plantSchema.index({ operationalStatus: 1 });

module.exports = mongoose.model('Plant', plantSchema);
