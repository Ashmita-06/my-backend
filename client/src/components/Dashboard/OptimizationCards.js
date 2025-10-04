import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Target,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  PlayCircle
} from 'lucide-react';

const OptimizationCards = ({ optimizations, plantId }) => {
  const mockOptimizations = [
    {
      id: 1,
      title: 'Boiler Efficiency Optimization',
      type: 'efficiency',
      status: 'proposed',
      priority: 'high',
      description: 'Implement advanced combustion control and heat recovery systems',
      potentialSavings: 500000,
      investment: 2000000,
      roi: 2.5,
      implementationTime: 6,
      emissionReduction: 15,
      efficiencyGain: 8,
      confidence: 85
    },
    {
      id: 2,
      title: 'Carbon Capture System',
      type: 'emissions',
      status: 'approved',
      priority: 'medium',
      description: 'Install post-combustion CO2 capture with utilization',
      potentialSavings: 1200000,
      investment: 15000000,
      roi: 0.08,
      implementationTime: 18,
      emissionReduction: 90,
      efficiencyGain: 0,
      confidence: 75
    },
    {
      id: 3,
      title: 'Predictive Maintenance',
      type: 'maintenance',
      status: 'in_progress',
      priority: 'medium',
      description: 'AI-powered maintenance optimization system',
      potentialSavings: 300000,
      investment: 500000,
      roi: 0.6,
      implementationTime: 6,
      emissionReduction: 5,
      efficiencyGain: 3,
      confidence: 90
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'proposed':
        return <AlertCircle className="w-4 h-4 text-warning-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-success-500" />;
      case 'in_progress':
        return <PlayCircle className="w-4 h-4 text-primary-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-secondary-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'proposed':
        return 'bg-warning-50 border-warning-200 text-warning-800';
      case 'approved':
        return 'bg-success-50 border-success-200 text-success-800';
      case 'in_progress':
        return 'bg-primary-50 border-primary-200 text-primary-800';
      default:
        return 'bg-secondary-50 border-secondary-200 text-secondary-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-error-100 text-error-800 border-error-200';
      case 'medium':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'low':
        return 'bg-success-100 text-success-800 border-success-200';
      default:
        return 'bg-secondary-100 text-secondary-800 border-secondary-200';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">
              Optimization Opportunities
            </h3>
            <p className="text-sm text-secondary-600">
              AI-powered recommendations for your plant
            </p>
          </div>
          <button className="btn btn-primary btn-sm">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {mockOptimizations.map((optimization, index) => (
            <motion.div
              key={optimization.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-secondary-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(optimization.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(optimization.status)}`}>
                    {optimization.status.replace('_', ' ')}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(optimization.priority)}`}>
                  {optimization.priority}
                </span>
              </div>

              {/* Title and Description */}
              <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                {optimization.title}
              </h4>
              <p className="text-sm text-secondary-600 mb-4">
                {optimization.description}
              </p>

              {/* Metrics */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Annual Savings</span>
                  <span className="text-sm font-semibold text-success-600">
                    {formatCurrency(optimization.potentialSavings)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Investment</span>
                  <span className="text-sm font-semibold text-secondary-900">
                    {formatCurrency(optimization.investment)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">ROI</span>
                  <span className="text-sm font-semibold text-primary-600">
                    {optimization.roi > 1 ? `${optimization.roi.toFixed(1)}x` : `${(optimization.roi * 100).toFixed(1)}%`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Implementation</span>
                  <span className="text-sm font-semibold text-secondary-900">
                    {optimization.implementationTime} months
                  </span>
                </div>
              </div>

              {/* Impact indicators */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-success-500" />
                  <span className="text-xs text-secondary-600">
                    -{optimization.emissionReduction}% CO2
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-primary-500" />
                  <span className="text-xs text-secondary-600">
                    +{optimization.efficiencyGain}% efficiency
                  </span>
                </div>
              </div>

              {/* Confidence and Action */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span className="text-xs text-secondary-600">
                    {optimization.confidence}% confidence
                  </span>
                </div>
                <button className="btn btn-primary btn-sm">
                  {optimization.status === 'proposed' ? 'Review' : 'View Details'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OptimizationCards;
