import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Target,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  Calendar,
  ArrowRight
} from 'lucide-react';

const CostOpportunities = ({ data }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const mockOpportunities = [
    {
      id: 1,
      title: 'Advanced Combustion Control',
      category: 'efficiency',
      priority: 'high',
      status: 'proposed',
      description: 'Implement AI-powered combustion optimization to reduce fuel consumption and emissions',
      potentialSavings: 1200000,
      investment: 800000,
      roi: 1.5,
      paybackPeriod: 8,
      implementationTime: 6,
      confidence: 85,
      tags: ['AI', 'Efficiency', 'Emissions'],
      benefits: [
        '15% reduction in fuel consumption',
        '20% decrease in CO2 emissions',
        'Improved combustion efficiency'
      ]
    },
    {
      id: 2,
      title: 'Heat Recovery System',
      category: 'energy',
      priority: 'medium',
      status: 'approved',
      description: 'Install waste heat recovery system to capture and utilize excess heat',
      potentialSavings: 800000,
      investment: 1500000,
      roi: 0.53,
      paybackPeriod: 18,
      implementationTime: 12,
      confidence: 90,
      tags: ['Energy', 'Heat Recovery', 'Efficiency'],
      benefits: [
        '25% reduction in energy waste',
        '10% overall efficiency improvement',
        'Reduced cooling water requirements'
      ]
    },
    {
      id: 3,
      title: 'Predictive Maintenance',
      category: 'maintenance',
      priority: 'high',
      status: 'in_progress',
      description: 'AI-driven maintenance optimization to prevent failures and reduce downtime',
      potentialSavings: 600000,
      investment: 400000,
      roi: 1.5,
      paybackPeriod: 8,
      implementationTime: 4,
      confidence: 95,
      tags: ['AI', 'Maintenance', 'Reliability'],
      benefits: [
        '30% reduction in unplanned downtime',
        '20% decrease in maintenance costs',
        'Improved equipment reliability'
      ]
    },
    {
      id: 4,
      title: 'Carbon Capture System',
      category: 'emissions',
      priority: 'medium',
      status: 'proposed',
      description: 'Post-combustion CO2 capture with utilization for value-added products',
      potentialSavings: 2000000,
      investment: 15000000,
      roi: 0.13,
      paybackPeriod: 90,
      implementationTime: 24,
      confidence: 75,
      tags: ['Carbon Capture', 'Emissions', 'Innovation'],
      benefits: [
        '90% CO2 capture rate',
        'Revenue from CO2 utilization',
        'Environmental compliance'
      ]
    },
    {
      id: 5,
      title: 'Fuel Switching Optimization',
      category: 'fuel',
      priority: 'low',
      status: 'proposed',
      description: 'Optimize fuel mix to reduce costs while maintaining efficiency',
      potentialSavings: 400000,
      investment: 200000,
      roi: 2.0,
      paybackPeriod: 6,
      implementationTime: 3,
      confidence: 80,
      tags: ['Fuel', 'Cost', 'Optimization'],
      benefits: [
        '15% reduction in fuel costs',
        'Maintained efficiency levels',
        'Flexible fuel sourcing'
      ]
    }
  ];

  const categories = [
    { id: 'all', label: 'All Categories', count: mockOpportunities.length },
    { id: 'efficiency', label: 'Efficiency', count: mockOpportunities.filter(opp => opp.category === 'efficiency').length },
    { id: 'energy', label: 'Energy', count: mockOpportunities.filter(opp => opp.category === 'energy').length },
    { id: 'maintenance', label: 'Maintenance', count: mockOpportunities.filter(opp => opp.category === 'maintenance').length },
    { id: 'emissions', label: 'Emissions', count: mockOpportunities.filter(opp => opp.category === 'emissions').length },
    { id: 'fuel', label: 'Fuel', count: mockOpportunities.filter(opp => opp.category === 'fuel').length }
  ];

  const priorities = [
    { id: 'all', label: 'All Priorities' },
    { id: 'high', label: 'High Priority' },
    { id: 'medium', label: 'Medium Priority' },
    { id: 'low', label: 'Low Priority' }
  ];

  const filteredOpportunities = mockOpportunities.filter(opportunity => {
    const categoryMatch = selectedCategory === 'all' || opportunity.category === selectedCategory;
    const priorityMatch = selectedPriority === 'all' || opportunity.priority === selectedPriority;
    return categoryMatch && priorityMatch;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'implemented':
        return CheckCircle;
      case 'in_progress':
        return PlayCircle;
      case 'approved':
        return CheckCircle;
      case 'proposed':
        return Target;
      default:
        return AlertCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label} ({category.count})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {priorities.map(priority => (
                <option key={priority.id} value={priority.id}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOpportunities.map((opportunity, index) => {
          const StatusIcon = getStatusIcon(opportunity.status);
          return (
            <motion.div
              key={opportunity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {opportunity.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {opportunity.description}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(opportunity.priority)}`}>
                      {opportunity.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(opportunity.status)}`}>
                      {opportunity.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Potential Savings</p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(opportunity.potentialSavings)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Investment</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(opportunity.investment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">ROI</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {opportunity.roi}x
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Payback</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {opportunity.paybackPeriod} months
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Confidence</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {opportunity.confidence}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${opportunity.confidence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {opportunity.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Key Benefits:
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {opportunity.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {opportunity.implementationTime} months
                  </div>
                  <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                    View Details
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredOpportunities.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No opportunities found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters to see more opportunities.
          </p>
        </div>
      )}
    </div>
  );
};

export default CostOpportunities;
