import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const CostReductionOverview = ({ data }) => {
  const mockData = {
    totalSavings: 2500000,
    potentialSavings: 4500000,
    implementedSavings: 1800000,
    pendingSavings: 2700000,
    monthlyTrend: 12.5,
    yearlyProjection: 3200000,
    opportunities: [
      {
        id: 1,
        title: 'Fuel Optimization',
        savings: 800000,
        status: 'implemented',
        progress: 100
      },
      {
        id: 2,
        title: 'Efficiency Improvements',
        savings: 600000,
        status: 'in_progress',
        progress: 75
      },
      {
        id: 3,
        title: 'Maintenance Optimization',
        savings: 400000,
        status: 'pending',
        progress: 0
      }
    ],
    recentActivities: [
      {
        id: 1,
        action: 'Fuel optimization implemented',
        savings: 150000,
        date: '2024-01-15',
        status: 'completed'
      },
      {
        id: 2,
        action: 'Efficiency audit completed',
        savings: 0,
        date: '2024-01-10',
        status: 'in_progress'
      },
      {
        id: 3,
        action: 'Maintenance schedule optimized',
        savings: 75000,
        date: '2024-01-05',
        status: 'completed'
      }
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'implemented':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'pending':
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
        return AlertCircle;
      case 'pending':
        return Target;
      default:
        return AlertCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Savings
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(mockData.totalSavings)}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">
              +{mockData.monthlyTrend}% this month
            </span>
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
                Potential Savings
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(mockData.potentialSavings)}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(mockData.implementedSavings / mockData.potentialSavings) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {Math.round((mockData.implementedSavings / mockData.potentialSavings) * 100)}% implemented
            </p>
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
                Implemented
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(mockData.implementedSavings)}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {mockData.opportunities.filter(opp => opp.status === 'implemented').length} opportunities
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
                Pending
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(mockData.pendingSavings)}
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {mockData.opportunities.filter(opp => opp.status === 'pending').length} opportunities
            </p>
          </div>
        </motion.div>
      </div>

      {/* Opportunities */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Cost Reduction Opportunities
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockData.opportunities.map((opportunity, index) => {
              const StatusIcon = getStatusIcon(opportunity.status);
              return (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${getStatusColor(opportunity.status)}`}>
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {opportunity.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Potential savings: {formatCurrency(opportunity.savings)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(opportunity.savings)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {opportunity.progress}% complete
                      </p>
                    </div>
                    <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${opportunity.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activities
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockData.recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(activity.savings)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.status}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostReductionOverview;
