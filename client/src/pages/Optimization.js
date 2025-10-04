import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { optimizationAPI } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import OptimizationList from '../components/Optimization/OptimizationList';
import OptimizationFilters from '../components/Optimization/OptimizationFilters';
import AIRecommendations from '../components/Optimization/AIRecommendations';
import OptimizationAnalytics from '../components/Optimization/OptimizationAnalytics';

const Optimization = () => {
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    priority: '',
    page: 1,
    limit: 20
  });

  const { data: optimizations, isLoading, error } = useQuery(
    ['optimizations', filters],
    () => optimizationAPI.getOptimizations(filters),
    {
      keepPreviousData: true,
      staleTime: 30000
    }
  );

  const { data: analytics } = useQuery(
    'optimization-analytics',
    () => optimizationAPI.getAnalytics({ period: '30d' }),
    {
      staleTime: 60000
    }
  );

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  if (isLoading && !optimizations) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-error-600 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-secondary-900 mb-2">
          Failed to load optimization data
        </h3>
        <p className="text-secondary-600">
          Please try refreshing the page or contact support if the problem persists.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          AI Optimization
        </h1>
        <p className="text-secondary-600">
          AI-powered recommendations for reducing emissions and optimizing costs
        </p>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <OptimizationAnalytics data={analytics.data} />
        </motion.div>
      )}

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <AIRecommendations />
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <OptimizationFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </motion.div>

      {/* Optimization List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <OptimizationList
          data={optimizations}
          isLoading={isLoading}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </motion.div>
    </motion.div>
  );
};

export default Optimization;
