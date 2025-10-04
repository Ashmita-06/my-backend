const express = require('express');
const jwt = require('jsonwebtoken');
const OpenAI = require('openai');
const Emission = require('../models/Emission');
const Plant = require('../models/Plant');
const Optimization = require('../models/Optimization');
const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key'
});

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

// Chat with AI assistant
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { message, plantId, context } = req.body;

    // Get plant and recent data for context
    let plantData = null;
    let recentEmissions = null;
    let recentOptimizations = null;

    if (plantId) {
      plantData = await Plant.findById(plantId);
      recentEmissions = await Emission.find({ plantId })
        .sort({ timestamp: -1 })
        .limit(10);
      recentOptimizations = await Optimization.find({ plantId })
        .sort({ createdAt: -1 })
        .limit(5);
    }

    // Build context for AI
    const systemPrompt = buildSystemPrompt(plantData, recentEmissions, recentOptimizations);
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const aiResponse = completion.choices[0].message.content;

    // Save chat history (optional - you might want to create a Chat model)
    // const chatRecord = new Chat({
    //   userId: req.user.userId,
    //   plantId,
    //   userMessage: message,
    //   aiResponse,
    //   timestamp: new Date()
    // });
    // await chatRecord.save();

    res.json({
      response: aiResponse,
      timestamp: new Date(),
      context: {
        plantId,
        plantName: plantData?.name,
        hasRecentData: recentEmissions?.length > 0
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      message: 'Error processing your request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get quick suggestions based on current plant status
router.get('/suggestions', authenticateToken, async (req, res) => {
  try {
    const { plantId } = req.query;

    if (!plantId) {
      return res.status(400).json({ message: 'Plant ID is required' });
    }

    // Get plant and recent data
    const plant = await Plant.findById(plantId);
    const recentEmissions = await Emission.find({ plantId })
      .sort({ timestamp: -1 })
      .limit(50);

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    // Analyze data and generate suggestions
    const suggestions = await generateQuickSuggestions(plant, recentEmissions);

    res.json({
      suggestions,
      plant: {
        id: plant._id,
        name: plant.name,
        type: plant.plantType,
        capacity: plant.capacity
      },
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ message: 'Server error generating suggestions' });
  }
});

// Get FAQ responses
router.get('/faq', async (req, res) => {
  try {
    const faqData = [
      {
        category: 'Carbon Emissions',
        questions: [
          {
            question: 'How can I reduce CO2 emissions from my thermal plant?',
            answer: 'Several strategies can help reduce CO2 emissions: 1) Improve combustion efficiency through advanced control systems, 2) Implement carbon capture and storage (CCS), 3) Switch to cleaner fuels or co-firing with biomass, 4) Optimize plant operations and maintenance, 5) Implement waste heat recovery systems.'
          },
          {
            question: 'What is carbon intensity and how is it calculated?',
            answer: 'Carbon intensity is the amount of CO2 emitted per unit of energy produced, typically measured in kg CO2 per MWh. It\'s calculated by dividing total CO2 emissions by total energy output. Lower values indicate more efficient, cleaner operations.'
          },
          {
            question: 'How effective is carbon capture technology?',
            answer: 'Modern carbon capture systems can capture 85-95% of CO2 emissions. The effectiveness depends on the technology used (post-combustion, pre-combustion, or oxy-fuel) and plant-specific factors. Costs range from $40-80 per ton of CO2 captured.'
          }
        ]
      },
      {
        category: 'Cost Optimization',
        questions: [
          {
            question: 'What are the main cost drivers in thermal plant operations?',
            answer: 'The main cost drivers are: 1) Fuel costs (40-60% of total), 2) Operations and maintenance (20-30%), 3) Carbon taxes/credits (5-15%), 4) Labor costs (10-20%), and 5) Environmental compliance costs (5-10%).'
          },
          {
            question: 'How can I reduce fuel costs?',
            answer: 'Fuel cost reduction strategies include: 1) Fuel quality optimization and blending, 2) Advanced combustion control, 3) Heat rate improvement, 4) Fuel switching to cheaper alternatives, 5) Long-term fuel contracts, and 6) Waste-to-energy integration.'
          }
        ]
      },
      {
        category: 'Efficiency Improvements',
        questions: [
          {
            question: 'What is the typical efficiency range for thermal plants?',
            answer: 'Thermal plant efficiency varies by type: Coal plants: 30-45%, Natural gas combined cycle: 50-60%, Natural gas simple cycle: 35-45%, Oil-fired: 35-40%. Efficiency can be improved through upgrades and optimization.'
          },
          {
            question: 'How can I improve plant efficiency?',
            answer: 'Efficiency improvements include: 1) Boiler optimization and tuning, 2) Turbine upgrades, 3) Heat recovery systems, 4) Advanced control systems, 5) Regular maintenance and cleaning, 6) Fuel quality improvements, and 7) Operational optimization.'
          }
        ]
      }
    ];

    res.json({ faq: faqData });
  } catch (error) {
    console.error('Get FAQ error:', error);
    res.status(500).json({ message: 'Server error fetching FAQ' });
  }
});

// Build system prompt for AI assistant
function buildSystemPrompt(plant, emissions, optimizations) {
  let prompt = `You are an AI assistant specialized in carbon emissions reduction for thermal power plants. You provide expert advice on:

1. Carbon emission reduction strategies
2. Cost optimization for thermal plants
3. Efficiency improvements
4. Carbon capture and utilization technologies
5. Regulatory compliance and carbon markets
6. Technical troubleshooting and optimization

Your responses should be:
- Technically accurate and data-driven
- Practical and implementable
- Cost-conscious
- Environmentally focused
- Clear and actionable

`;

  if (plant) {
    prompt += `\nCurrent Plant Context:
- Plant Name: ${plant.name}
- Type: ${plant.plantType}
- Capacity: ${plant.capacity} MW
- Location: ${plant.location.city}, ${plant.location.state}
- Current Efficiency: ${plant.efficiency}%
- Carbon Intensity: ${plant.carbonIntensity} kg CO2/MWh
`;

    if (emissions && emissions.length > 0) {
      const latestEmission = emissions[0];
      prompt += `\nRecent Performance:
- Latest CO2 Emissions: ${latestEmission.emissions?.co2?.value || 'N/A'} kg
- Power Generation: ${latestEmission.powerGeneration?.value || 'N/A'} MWh
- Efficiency: ${latestEmission.efficiency?.overall || 'N/A'}%
- Carbon Intensity: ${latestEmission.carbonIntensity || 'N/A'} kg CO2/MWh
`;
    }

    if (optimizations && optimizations.length > 0) {
      prompt += `\nRecent Optimization Activities:
${optimizations.map(opt => `- ${opt.title} (${opt.status})`).join('\n')}
`;
    }
  }

  prompt += `\nAlways provide specific, actionable recommendations with estimated costs and benefits when possible.`;

  return prompt;
}

// Generate quick suggestions based on plant data
async function generateQuickSuggestions(plant, emissions) {
  const suggestions = [];

  if (!emissions || emissions.length === 0) {
    return [{
      type: 'data',
      priority: 'high',
      title: 'Start Data Collection',
      description: 'Begin collecting real-time emissions and operational data to enable AI-powered optimization.',
      action: 'Set up monitoring systems'
    }];
  }

  // Analyze recent performance
  const avgEfficiency = emissions.reduce((sum, e) => sum + (e.efficiency?.overall || 0), 0) / emissions.length;
  const avgCarbonIntensity = emissions.reduce((sum, e) => sum + (e.carbonIntensity || 0), 0) / emissions.length;
  const totalCO2 = emissions.reduce((sum, e) => sum + (e.emissions?.co2?.value || 0), 0);

  // Efficiency suggestions
  if (avgEfficiency < 40) {
    suggestions.push({
      type: 'efficiency',
      priority: 'high',
      title: 'Improve Thermal Efficiency',
      description: `Current efficiency is ${avgEfficiency.toFixed(1)}%. Consider boiler tuning and heat recovery systems.`,
      potentialSavings: '15-25% efficiency gain',
      action: 'Schedule efficiency audit'
    });
  }

  // Carbon intensity suggestions
  if (avgCarbonIntensity > 800) {
    suggestions.push({
      type: 'emissions',
      priority: 'high',
      title: 'Reduce Carbon Intensity',
      description: `Current carbon intensity is ${avgCarbonIntensity.toFixed(1)} kg CO2/MWh. Implement optimization measures.`,
      potentialSavings: '10-20% emission reduction',
      action: 'Review combustion parameters'
    });
  }

  // Carbon capture suggestions
  if (totalCO2 > 1000000) {
    suggestions.push({
      type: 'carbon_capture',
      priority: 'medium',
      title: 'Consider Carbon Capture',
      description: 'High CO2 emissions detected. Evaluate carbon capture and utilization options.',
      potentialSavings: '80-90% emission reduction',
      action: 'Feasibility study for CCS'
    });
  }

  // General optimization
  suggestions.push({
    type: 'optimization',
    priority: 'medium',
    title: 'AI-Powered Optimization',
    description: 'Use machine learning to optimize plant operations and reduce emissions.',
    potentialSavings: '5-15% overall improvement',
    action: 'Enable AI optimization features'
  });

  return suggestions;
}

module.exports = router;
