import React from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { analyticsAPI } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import KPIOverview from '../components/Dashboard/KPIOverview';
import EmissionsChart from '../components/Dashboard/EmissionsChart';
import OptimizationCards from '../components/Dashboard/OptimizationCards';
import RecentActivity from '../components/Dashboard/RecentActivity';
import CostBreakdown from '../components/Dashboard/CostBreakdown';
import AlertPanel from '../components/Dashboard/AlertPanel';

const Dashboard = () => {
  const { data: dashboardData, isLoading, error } = useQuery(
    'dashboard',
    () => analyticsAPI.getDashboard({ period: '30d' }),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      staleTime: 10000, // Consider data stale after 10 seconds
    }
  );

  if (isLoading) {
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
          Failed to load dashboard
        </h3>
        <p className="text-secondary-600">
          Please try refreshing the page or contact support if the problem persists.
        </p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Dashboard
        </h1>
        <p className="text-secondary-600">
          Monitor your plant's performance and carbon emissions in real-time
        </p>
      </motion.div>

      {/* Alerts */}
      <motion.div variants={itemVariants}>
        <AlertPanel />
      </motion.div>

      {/* KPI Overview */}
      <motion.div variants={itemVariants}>
        <KPIOverview data={dashboardData?.kpis} />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <EmissionsChart 
            data={dashboardData?.timeSeries} 
            plant={dashboardData?.plant}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <CostBreakdown data={dashboardData?.costBreakdown} />
        </motion.div>
      </div>

      {/* Optimization Cards */}
      <motion.div variants={itemVariants}>
        <OptimizationCards 
          optimizations={dashboardData?.optimizations}
          plantId={dashboardData?.plant?.id}
        />
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <RecentActivity />
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
