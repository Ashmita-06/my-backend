const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Plant = require('../models/Plant');
const Emission = require('../models/Emission');
const Optimization = require('../models/Optimization');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carbon-emissions', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    console.log('🌱 Starting data seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Plant.deleteMany({});
    await Emission.deleteMany({});
    await Optimization.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create users
    const users = await User.insertMany([
      {
        name: 'John Smith',
        email: 'john@example.com',
        password: 'password123',
        role: 'admin',
        organization: 'Green Energy Corp',
        preferences: {
          notifications: true,
          dashboard: 'overview'
        }
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: 'password123',
        role: 'plant_manager',
        organization: 'Green Energy Corp',
        preferences: {
          notifications: true,
          dashboard: 'detailed'
        }
      },
      {
        name: 'Mike Chen',
        email: 'mike@example.com',
        password: 'password123',
        role: 'analyst',
        organization: 'Green Energy Corp',
        preferences: {
          notifications: false,
          dashboard: 'overview'
        }
      }
    ]);
    console.log('✅ Created users');

    // Create plants
    const plants = await Plant.insertMany([
      {
        name: 'Coal Power Plant A',
        location: {
          address: '123 Energy Street',
          city: 'Springfield',
          state: 'Illinois',
          country: 'USA',
          coordinates: { latitude: 39.7817, longitude: -89.6501 }
        },
        plantType: 'coal',
        capacity: 500,
        operationalStatus: 'operational',
        commissioningDate: new Date('2010-01-15'),
        efficiency: 35,
        carbonIntensity: 900,
        fuelConsumption: {
          type: 'coal',
          consumptionRate: 150,
          calorificValue: 25
        },
        emissionFactors: {
          co2: 2.5,
          ch4: 0.01,
          n2o: 0.005
        },
        controlTechnologies: [
          {
            name: 'Electrostatic Precipitator',
            type: 'filter',
            efficiency: 99.5,
            installationDate: new Date('2010-01-15'),
            status: 'active'
          },
          {
            name: 'Flue Gas Desulfurization',
            type: 'scrubber',
            efficiency: 95,
            installationDate: new Date('2015-06-01'),
            status: 'active'
          }
        ],
        carbonCapture: {
          enabled: false,
          capacity: 0,
          efficiency: 0,
          storageMethod: 'geological'
        },
        utilization: {
          enabled: false,
          products: [],
          totalRevenue: 0
        },
        financials: {
          operatingCost: 45,
          maintenanceCost: 8,
          carbonTax: 50,
          revenue: 60
        }
      },
      {
        name: 'Natural Gas Plant B',
        location: {
          address: '456 Power Avenue',
          city: 'Houston',
          state: 'Texas',
          country: 'USA',
          coordinates: { latitude: 29.7604, longitude: -95.3698 }
        },
        plantType: 'natural_gas',
        capacity: 300,
        operationalStatus: 'operational',
        commissioningDate: new Date('2018-03-20'),
        efficiency: 50,
        carbonIntensity: 400,
        fuelConsumption: {
          type: 'natural_gas',
          consumptionRate: 200,
          calorificValue: 50
        },
        emissionFactors: {
          co2: 1.8,
          ch4: 0.02,
          n2o: 0.003
        },
        controlTechnologies: [
          {
            name: 'Selective Catalytic Reduction',
            type: 'catalyst',
            efficiency: 90,
            installationDate: new Date('2018-03-20'),
            status: 'active'
          }
        ],
        carbonCapture: {
          enabled: true,
          capacity: 100000,
          efficiency: 85,
          storageMethod: 'enhanced_oil_recovery'
        },
        utilization: {
          enabled: true,
          products: [
            {
              name: 'Methanol',
              type: 'chemicals',
              productionRate: 50,
              marketValue: 300,
              revenue: 15000
            }
          ],
          totalRevenue: 15000
        },
        financials: {
          operatingCost: 35,
          maintenanceCost: 6,
          carbonTax: 20,
          revenue: 55
        }
      }
    ]);
    console.log('✅ Created plants');

    // Update users with plant assignments
    users[1].plantId = plants[0]._id;
    users[2].plantId = plants[1]._id;
    await users[1].save();
    await users[2].save();

    // Generate sample emissions data
    const emissions = [];
    const now = new Date();
    
    for (let i = 0; i < 100; i++) {
      const timestamp = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000)); // Daily data for last 100 days
      const plant = plants[i % 2]; // Alternate between plants
      
      // Generate realistic data based on plant type
      const baseCO2 = plant.plantType === 'coal' ? 800 + Math.random() * 400 : 300 + Math.random() * 200;
      const basePower = plant.capacity * (0.7 + Math.random() * 0.3); // 70-100% capacity
      const efficiency = plant.efficiency + (Math.random() - 0.5) * 10; // ±5% variation
      const carbonIntensity = baseCO2 / basePower;

      emissions.push({
        plantId: plant._id,
        timestamp,
        emissions: {
          co2: {
            value: baseCO2,
            unit: 'kg',
            source: 'total'
          },
          ch4: {
            value: baseCO2 * 0.01,
            unit: 'kg'
          },
          n2o: {
            value: baseCO2 * 0.005,
            unit: 'kg'
          }
        },
        powerGeneration: {
          value: basePower,
          unit: 'MWh'
        },
        fuelConsumption: {
          type: plant.fuelConsumption.type,
          amount: basePower * 0.3,
          unit: plant.plantType === 'coal' ? 'tons' : 'MCF'
        },
        efficiency: {
          thermal: efficiency,
          electrical: efficiency * 0.9,
          overall: efficiency
        },
        carbonIntensity,
        weather: {
          temperature: 15 + Math.random() * 20,
          humidity: 40 + Math.random() * 40,
          pressure: 1000 + Math.random() * 50,
          windSpeed: Math.random() * 15,
          windDirection: Math.random() * 360
        },
        operatingConditions: {
          loadFactor: 70 + Math.random() * 30,
          ambientTemperature: 15 + Math.random() * 20,
          coolingWaterTemperature: 20 + Math.random() * 10,
          steamPressure: 100 + Math.random() * 50,
          steamTemperature: 400 + Math.random() * 100
        },
        controlEfficiency: {
          scrubber: 90 + Math.random() * 10,
          catalyst: 85 + Math.random() * 15,
          filter: 95 + Math.random() * 5,
          overall: 90 + Math.random() * 10
        },
        carbonCapture: {
          captured: plant.carbonCapture.enabled ? baseCO2 * 0.8 : 0,
          efficiency: plant.carbonCapture.efficiency,
          storage: plant.carbonCapture.enabled ? baseCO2 * 0.7 : 0,
          utilization: plant.carbonCapture.enabled ? baseCO2 * 0.1 : 0
        },
        dataQuality: {
          source: 'sensor',
          confidence: 90 + Math.random() * 10,
          validated: Math.random() > 0.1
        },
        costs: {
          fuel: basePower * plant.financials.operatingCost,
          operation: basePower * 5,
          maintenance: basePower * 2,
          carbonTax: baseCO2 * plant.financials.carbonTax / 1000,
          total: basePower * plant.financials.operatingCost + baseCO2 * plant.financials.carbonTax / 1000
        },
        metadata: {
          operator: users[1 + (i % 2)].name,
          shift: ['morning', 'afternoon', 'night'][i % 3],
          notes: i % 10 === 0 ? 'Maintenance performed' : '',
          tags: ['normal', 'optimized'][Math.floor(Math.random() * 2)]
        }
      });
    }

    await Emission.insertMany(emissions);
    console.log('✅ Created emissions data');

    // Create optimization recommendations
    const optimizations = await Optimization.insertMany([
      {
        plantId: plants[0]._id,
        optimizationType: 'efficiency_improvement',
        title: 'Boiler Efficiency Optimization',
        description: 'Implement advanced combustion control and heat recovery systems to improve thermal efficiency',
        currentState: {
          emissions: { co2: 900, ch4: 5, n2o: 2, total: 907 },
          costs: { fuel: 22500, operation: 2500, maintenance: 1000, carbonTax: 45000, total: 70000 },
          efficiency: { thermal: 35, electrical: 32, overall: 35 }
        },
        proposedState: {
          emissions: { co2: 765, ch4: 4, n2o: 2, total: 771 },
          costs: { fuel: 19125, operation: 2500, maintenance: 1000, carbonTax: 38250, total: 60875 },
          efficiency: { thermal: 42, electrical: 38, overall: 42 }
        },
        improvements: {
          emissionReduction: { co2: 15, ch4: 20, n2o: 0, total: 15 },
          costSavings: { annual: 9125, percentage: 13 },
          efficiencyGain: { thermal: 7, electrical: 6, overall: 7 }
        },
        implementation: {
          cost: { capital: 2000000, operational: 100000, maintenance: 50000, total: 2150000 },
          timeline: { planning: 2, implementation: 6, commissioning: 2, total: 10 },
          complexity: 'medium',
          risk: 'low'
        },
        roi: {
          paybackPeriod: 2.4,
          netPresentValue: 1500000,
          internalRateOfReturn: 25,
          benefitCostRatio: 1.4
        },
        status: 'proposed',
        priority: 'high',
        aiRecommendation: {
          confidence: 85,
          reasoning: 'High efficiency improvement potential with proven technology',
          alternatives: ['Fuel switching', 'Waste heat recovery'],
          risks: ['Implementation complexity', 'Downtime during installation'],
          benefits: ['Reduced emissions', 'Lower operating costs', 'Improved efficiency']
        },
        createdBy: users[1]._id,
        tags: ['efficiency', 'emissions', 'cost-reduction']
      },
      {
        plantId: plants[1]._id,
        optimizationType: 'carbon_capture',
        title: 'Post-Combustion Carbon Capture',
        description: 'Install amine-based CO2 capture system with utilization for value-added products',
        currentState: {
          emissions: { co2: 400, ch4: 2, n2o: 1, total: 403 },
          costs: { fuel: 10500, operation: 1500, maintenance: 600, carbonTax: 20000, total: 32600 },
          efficiency: { thermal: 50, electrical: 45, overall: 50 }
        },
        proposedState: {
          emissions: { co2: 40, ch4: 2, n2o: 1, total: 43 },
          costs: { fuel: 10500, operation: 1500, maintenance: 600, carbonTax: 2000, total: 14600 },
          efficiency: { thermal: 50, electrical: 45, overall: 50 }
        },
        improvements: {
          emissionReduction: { co2: 90, ch4: 0, n2o: 0, total: 90 },
          costSavings: { annual: 18000, percentage: 55 },
          efficiencyGain: { thermal: 0, electrical: 0, overall: 0 }
        },
        implementation: {
          cost: { capital: 15000000, operational: 2000000, maintenance: 500000, total: 17500000 },
          timeline: { planning: 6, implementation: 18, commissioning: 6, total: 30 },
          complexity: 'high',
          risk: 'medium'
        },
        roi: {
          paybackPeriod: 8.5,
          netPresentValue: 5000000,
          internalRateOfReturn: 8,
          benefitCostRatio: 1.1
        },
        carbonCapture: {
          technology: 'Amine-based post-combustion',
          capacity: 100000,
          efficiency: 90,
          cost: 150,
          utilization: {
            enabled: true,
            products: ['Methanol', 'Urea', 'Building materials'],
            revenue: 2000000
          }
        },
        utilization: {
          products: [
            { name: 'Methanol', type: 'chemicals', productionRate: 100, marketValue: 300, revenue: 30000 },
            { name: 'Urea', type: 'fertilizers', productionRate: 50, marketValue: 200, revenue: 10000 },
            { name: 'Building materials', type: 'materials', productionRate: 200, marketValue: 100, revenue: 20000 }
          ],
          totalRevenue: 60000,
          marketPotential: 500000
        },
        status: 'proposed',
        priority: 'medium',
        aiRecommendation: {
          confidence: 75,
          reasoning: 'Significant emission reduction potential with revenue generation',
          alternatives: ['Pre-combustion capture', 'Oxy-fuel combustion'],
          risks: ['High capital cost', 'Technology maturity', 'Market volatility'],
          benefits: ['90% emission reduction', 'Revenue from utilization', 'Regulatory compliance']
        },
        createdBy: users[2]._id,
        tags: ['carbon-capture', 'utilization', 'emissions']
      }
    ]);
    console.log('✅ Created optimization recommendations');

    console.log('\n🎉 Data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Plants: ${plants.length}`);
    console.log(`- Emissions: ${emissions.length}`);
    console.log(`- Optimizations: ${optimizations.length}`);
    console.log('\n🔑 Default login credentials:');
    console.log('Admin: john@example.com / password123');
    console.log('Manager: sarah@example.com / password123');
    console.log('Analyst: mike@example.com / password123');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
