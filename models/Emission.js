const mongoose = require('mongoose');

const emissionSchema = new mongoose.Schema({
  plantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant',
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  emissions: {
    co2: {
      value: {
        type: Number,
        required: true,
        min: 0
      },
      unit: {
        type: String,
        default: 'kg'
      },
      source: {
        type: String,
        enum: ['combustion', 'process', 'fugitive', 'total'],
        default: 'total'
      }
    },
    ch4: {
      value: {
        type: Number,
        required: true,
        min: 0
      },
      unit: {
        type: String,
        default: 'kg'
      }
    },
    n2o: {
      value: {
        type: Number,
        required: true,
        min: 0
      },
      unit: {
        type: String,
        default: 'kg'
      }
    }
  },
  powerGeneration: {
    value: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      default: 'MWh'
    }
  },
  fuelConsumption: {
    type: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      required: true
    }
  },
  efficiency: {
    thermal: Number, // percentage
    electrical: Number, // percentage
    overall: Number // percentage
  },
  carbonIntensity: {
    type: Number, // kg CO2 per MWh
    required: true
  },
  weather: {
    temperature: Number, // Celsius
    humidity: Number, // percentage
    pressure: Number, // hPa
    windSpeed: Number, // m/s
    windDirection: Number // degrees
  },
  operatingConditions: {
    loadFactor: Number, // percentage
    ambientTemperature: Number, // Celsius
    coolingWaterTemperature: Number, // Celsius
    steamPressure: Number, // bar
    steamTemperature: Number // Celsius
  },
  controlEfficiency: {
    scrubber: Number, // percentage
    catalyst: Number, // percentage
    filter: Number, // percentage
    overall: Number // percentage
  },
  carbonCapture: {
    captured: {
      type: Number,
      default: 0
    },
    efficiency: {
      type: Number,
      default: 0
    },
    storage: {
      type: Number,
      default: 0
    },
    utilization: {
      type: Number,
      default: 0
    }
  },
  dataQuality: {
    source: {
      type: String,
      enum: ['sensor', 'manual', 'calculated', 'estimated'],
      default: 'sensor'
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 95
    },
    validated: {
      type: Boolean,
      default: false
    }
  },
  costs: {
    fuel: Number, // USD
    operation: Number, // USD
    maintenance: Number, // USD
    carbonTax: Number, // USD
    total: Number // USD
  },
  metadata: {
    operator: String,
    shift: String,
    notes: String,
    tags: [String]
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
emissionSchema.index({ plantId: 1, timestamp: -1 });
emissionSchema.index({ timestamp: -1 });
emissionSchema.index({ 'emissions.co2.value': -1 });
emissionSchema.index({ carbonIntensity: -1 });

// Virtual for CO2 equivalent
emissionSchema.virtual('co2Equivalent').get(function() {
  const co2 = this.emissions.co2.value;
  const ch4 = this.emissions.ch4.value * 25; // GWP of CH4
  const n2o = this.emissions.n2o.value * 298; // GWP of N2O
  return co2 + ch4 + n2o;
});

// Method to calculate carbon intensity
emissionSchema.methods.calculateCarbonIntensity = function() {
  if (this.powerGeneration.value > 0) {
    return this.emissions.co2.value / this.powerGeneration.value;
  }
  return 0;
};

module.exports = mongoose.model('Emission', emissionSchema);
