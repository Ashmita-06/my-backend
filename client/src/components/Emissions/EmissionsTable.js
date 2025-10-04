import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';

const EmissionsTable = ({ data, isLoading, filters, onFilterChange }) => {
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num?.toFixed(1) || '0';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 40) return 'text-success-600';
    if (efficiency >= 30) return 'text-warning-600';
    return 'text-error-600';
  };

  const getCarbonIntensityColor = (intensity) => {
    if (intensity <= 500) return 'text-success-600';
    if (intensity <= 800) return 'text-warning-600';
    return 'text-error-600';
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="skeleton h-16 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const emissions = data?.emissions || [];
  const pagination = data?.pagination || {};

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">
              Emissions Data
            </h3>
            <p className="text-sm text-secondary-600">
              {pagination.total || 0} records found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-primary btn-sm">
              Add Record
            </button>
            <button className="btn btn-secondary btn-sm">
              Export
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Plant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                CO2 (kg)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Power (MWh)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Efficiency (%)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Carbon Intensity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary-200">
            {emissions.map((emission, index) => (
              <motion.tr
                key={emission._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-secondary-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                  {format(new Date(emission.timestamp), 'MMM dd, yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <Activity className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-secondary-900">
                        {emission.plantId?.name || 'Plant A'}
                      </div>
                      <div className="text-sm text-secondary-500">
                        {emission.plantId?.plantType || 'Coal'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                  {formatNumber(emission.emissions?.co2?.value)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                  {formatNumber(emission.powerGeneration?.value)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getEfficiencyColor(emission.efficiency?.overall)}`}>
                    {emission.efficiency?.overall?.toFixed(1) || 'N/A'}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getCarbonIntensityColor(emission.carbonIntensity)}`}>
                    {emission.carbonIntensity?.toFixed(1) || 'N/A'} kg/MWh
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    emission.efficiency?.overall >= 40
                      ? 'bg-success-100 text-success-800'
                      : emission.efficiency?.overall >= 30
                      ? 'bg-warning-100 text-warning-800'
                      : 'bg-error-100 text-error-800'
                  }`}>
                    {emission.efficiency?.overall >= 40 ? 'Optimal' : 
                     emission.efficiency?.overall >= 30 ? 'Good' : 'Needs Attention'}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="card-footer">
          <div className="flex items-center justify-between">
            <div className="text-sm text-secondary-600">
              Showing {((pagination.current - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.current * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onFilterChange({ page: pagination.current - 1 })}
                disabled={pagination.current <= 1}
                className="btn btn-secondary btn-sm"
              >
                Previous
              </button>
              <span className="text-sm text-secondary-600">
                Page {pagination.current} of {pagination.pages}
              </span>
              <button
                onClick={() => onFilterChange({ page: pagination.current + 1 })}
                disabled={pagination.current >= pagination.pages}
                className="btn btn-secondary btn-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmissionsTable;
