import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { emissionsAPI } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import EmissionsChart from '../components/Emissions/EmissionsChart';
import EmissionsTable from '../components/Emissions/EmissionsTable';
import EmissionsFilters from '../components/Emissions/EmissionsFilters';
import RealTimeMonitor from '../components/Emissions/RealTimeMonitor';

const Emissions = () => {
  const [filters, setFilters] = useState({
    plantId: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 50
  });

  const { data: emissionsData, isLoading, error } = useQuery(
    ['emissions', filters],
    () => emissionsAPI.getEmissions(filters),
    {
      keepPreviousData: true,
      staleTime: 30000
    }
  );

  const { data: realtimeData } = useQuery(
    'realtime-emissions',
    () => emissionsAPI.getRealtime(filters.plantId),
    {
      enabled: !!filters.plantId,
      refetchInterval: 5000, // Refetch every 5 seconds
      staleTime: 0
    }
  );

  const { data: analyticsData } = useQuery(
    ['emissions-analytics', filters],
    () => emissionsAPI.getAnalytics(filters),
    {
      enabled: !!filters.plantId
    }
  );

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  if (isLoading && !emissionsData) {
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
          Failed to load emissions data
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
          Emissions Monitoring
        </h1>
        <p className="text-secondary-600">
          Real-time monitoring and analysis of carbon emissions from your thermal plants
        </p>
      </div>

      {/* Real-time Monitor */}
      {realtimeData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <RealTimeMonitor data={realtimeData} />
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <EmissionsFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </motion.div>

      {/* Analytics Charts */}
      {analyticsData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <EmissionsChart
            data={analyticsData}
            filters={filters}
          />
        </motion.div>
      )}

      {/* Emissions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <EmissionsTable
          data={emissionsData}
          isLoading={isLoading}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </motion.div>
    </motion.div>
  );
};

export default Emissions;
