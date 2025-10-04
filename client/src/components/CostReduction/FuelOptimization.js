import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  Fuel, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Calendar,
  Zap,
  Thermometer,
  Gauge,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const FuelOptimization = ({ data }) => {
  const [selectedFuel, setSelectedFuel] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const mockData = {
    fuelTypes: [
      { id: 'coal', name: 'Coal', cost: 45, efficiency: 35, emissions: 820, usage: 60 },
      { id: 'natural_gas', name: 'Natural Gas', cost: 35, efficiency: 55, emissions: 450, usage: 30 },
      { id: 'biomass', name: 'Biomass', cost: 25, efficiency: 40, emissions: 200, usage: 8 },
      { id: 'oil', name: 'Heavy Oil', cost: 55, efficiency: 45, emissions: 750, usage: 2 }
    ],
    optimizationHistory: [
      { date: '2024-01-01', coal: 65, natural_gas: 25, biomass: 8, oil: 2, efficiency: 38.5, cost: 42.5 },
      { date: '2024-01-15', coal: 60, natural_gas: 30, biomass: 8, oil: 2, efficiency: 42.1, cost: 40.8 },
      { date: '2024-02-01', coal: 58, natural_gas: 32, biomass: 8, oil: 2, efficiency: 43.2, cost: 39.5 },
      { date: '2024-02-15', coal: 55, natural_gas: 35, biomass: 8, oil: 2, efficiency: 44.8, cost: 38.2 },
      { date: '2024-03-01', coal: 52, natural_gas: 38, biomass: 8, oil: 2, efficiency: 46.1, cost: 36.9 },
      { date: '2024-03-15', coal: 50, natural_gas: 40, biomass: 8, oil: 2, efficiency: 47.3, cost: 35.8 }
    ],
    recommendations: [
      {
        id: 1,
        title: 'Increase Natural Gas Usage',
        description: 'Gradually increase natural gas from 30% to 40% to improve efficiency',
        potentialSavings: 120000,
        implementationCost: 50000,
        paybackPeriod: 5,
        priority: 'high',
        status: 'proposed'
      },
      {
        id: 2,
        title: 'Biomass Co-firing Optimization',
        description: 'Optimize biomass co-firing ratio to 12% for better cost-efficiency',
        potentialSavings: 80000,
        implementationCost: 30000,
        paybackPeriod: 4.5,
        priority: 'medium',
        status: 'approved'
      },
      {
        id: 3,
        title: 'Advanced Combustion Control',
        description: 'Implement AI-powered combustion optimization',
        potentialSavings: 200000,
        implementationCost: 150000,
        paybackPeriod: 9,
        priority: 'high',
        status: 'in_progress'
      }
    ],
    kpis: {
      currentEfficiency: 47.3,
      targetEfficiency: 50.0,
      currentCost: 35.8,
      baselineCost: 42.5,
      costSavings: 6.7,
      emissionReduction: 12.5,
      fuelDiversification: 78.5
    }
  };

  const periods = [
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '90d', label: 'Last 90 Days' },
    { id: '1y', label: 'Last Year' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'implemented':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'approved':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'proposed':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fuel Type
              </label>
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Fuels</option>
                {mockData.fuelTypes.map(fuel => (
                  <option key={fuel.id} value={fuel.id}>
                    {fuel.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Period
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {periods.map(period => (
                  <option key={period.id} value={period.id}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Current Efficiency
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockData.kpis.currentEfficiency}%
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Gauge className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(mockData.kpis.currentEfficiency / mockData.kpis.targetEfficiency) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Target: {mockData.kpis.targetEfficiency}%
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Cost per MWh
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${mockData.kpis.currentCost}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">
              -{mockData.kpis.costSavings}% vs baseline
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Emission Reduction
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockData.kpis.emissionReduction}%
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Thermometer className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              CO2 reduction achieved
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Fuel Diversification
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockData.kpis.fuelDiversification}%
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Fuel className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Risk mitigation score
            </p>
          </div>
        </motion.div>
      </div>

      {/* Fuel Mix Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Fuel Mix Optimization History
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData.optimizationHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="coal" stackId="1" stroke="#EF4444" fill="#EF4444" name="Coal" />
              <Area type="monotone" dataKey="natural_gas" stackId="1" stroke="#3B82F6" fill="#3B82F6" name="Natural Gas" />
              <Area type="monotone" dataKey="biomass" stackId="1" stroke="#10B981" fill="#10B981" name="Biomass" />
              <Area type="monotone" dataKey="oil" stackId="1" stroke="#F59E0B" fill="#F59E0B" name="Oil" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Fuel Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Fuel Type Comparison
          </h3>
          <div className="space-y-4">
            {mockData.fuelTypes.map((fuel, index) => (
              <div key={fuel.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {fuel.name}
                  </h4>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {fuel.usage}% usage
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Cost/MWh</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${fuel.cost}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Efficiency</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {fuel.efficiency}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">CO2/MWh</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {fuel.emissions}kg
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Optimization Recommendations
          </h3>
          <div className="space-y-4">
            {mockData.recommendations.map((rec, index) => (
              <div key={rec.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {rec.title}
                  </h4>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                      {rec.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(rec.status)}`}>
                      {rec.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {rec.description}
                </p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Savings</p>
                    <p className="font-semibold text-green-600">
                      {formatCurrency(rec.potentialSavings)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Investment</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(rec.implementationCost)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Payback</p>
                    <p className="font-semibold text-blue-600">
                      {rec.paybackPeriod} months
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FuelOptimization;
