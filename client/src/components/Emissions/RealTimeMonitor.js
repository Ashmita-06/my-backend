import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Target, AlertTriangle, CheckCircle } from 'lucide-react';

const RealTimeMonitor = ({ data }) => {
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num?.toFixed(1) || '0';
  };

  const getStatusColor = (value, thresholds) => {
    if (value <= thresholds.good) return 'text-success-600';
    if (value <= thresholds.warning) return 'text-warning-600';
    return 'text-error-600';
  };

  const getStatusIcon = (value, thresholds) => {
    if (value <= thresholds.good) return CheckCircle;
    if (value <= thresholds.warning) return AlertTriangle;
    return AlertTriangle;
  };

  const getStatusBg = (value, thresholds) => {
    if (value <= thresholds.good) return 'bg-success-50 border-success-200';
    if (value <= thresholds.warning) return 'bg-warning-50 border-warning-200';
    return 'bg-error-50 border-error-200';
  };

  const co2Value = data?.emissions?.co2?.value || 0;
  const powerValue = data?.powerGeneration?.value || 0;
  const efficiency = data?.efficiency?.overall || 0;
  const carbonIntensity = data?.carbonIntensity || 0;

  const metrics = [
    {
      label: 'CO2 Emissions',
      value: co2Value,
      unit: 'kg',
      icon: Activity,
      thresholds: { good: 500, warning: 1000 },
      color: 'text-error-600'
    },
    {
      label: 'Power Generation',
      value: powerValue,
      unit: 'MWh',
      icon: Zap,
      thresholds: { good: 100, warning: 50 },
      color: 'text-primary-600'
    },
    {
      label: 'Efficiency',
      value: efficiency,
      unit: '%',
      icon: Target,
      thresholds: { good: 40, warning: 30 },
      color: 'text-success-600'
    },
    {
      label: 'Carbon Intensity',
      value: carbonIntensity,
      unit: 'kg CO2/MWh',
      icon: Activity,
      thresholds: { good: 500, warning: 800 },
      color: 'text-warning-600'
    }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-success-500 rounded-full flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary-900">
                Real-time Monitor
              </h3>
              <p className="text-sm text-secondary-600">
                {data?.plantId?.name || 'Plant A'} • Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-secondary-600">Live</span>
          </div>
        </div>
      </div>
      
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => {
            const StatusIcon = getStatusIcon(metric.value, metric.thresholds);
            const statusBg = getStatusBg(metric.value, metric.thresholds);
            
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${statusBg} hover:shadow-md transition-shadow duration-200`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-white/50`}>
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <StatusIcon className={`w-5 h-5 ${
                    metric.value <= metric.thresholds.good ? 'text-success-600' :
                    metric.value <= metric.thresholds.warning ? 'text-warning-600' : 'text-error-600'
                  }`} />
                </div>
                
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-secondary-900">
                    {formatNumber(metric.value)}
                    <span className="text-sm font-normal text-secondary-600 ml-1">{metric.unit}</span>
                  </p>
                  <p className="text-sm text-secondary-600">
                    {metric.label}
                  </p>
                </div>
                
                <div className="mt-3 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    metric.value <= metric.thresholds.good ? 'bg-success-500' :
                    metric.value <= metric.thresholds.warning ? 'bg-warning-500' : 'bg-error-500'
                  }`} />
                  <span className={`text-xs ${
                    metric.value <= metric.thresholds.good ? 'text-success-600' :
                    metric.value <= metric.thresholds.warning ? 'text-warning-600' : 'text-error-600'
                  }`}>
                    {metric.value <= metric.thresholds.good ? 'Optimal' :
                     metric.value <= metric.thresholds.warning ? 'Warning' : 'Critical'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-secondary-600">Fuel Type:</span>
              <span className="ml-2 font-medium text-secondary-900">
                {data?.fuelConsumption?.type || 'Coal'}
              </span>
            </div>
            <div>
              <span className="text-secondary-600">Load Factor:</span>
              <span className="ml-2 font-medium text-secondary-900">
                {data?.operatingConditions?.loadFactor?.toFixed(1) || '85.2'}%
              </span>
            </div>
            <div>
              <span className="text-secondary-600">Ambient Temp:</span>
              <span className="ml-2 font-medium text-secondary-900">
                {data?.weather?.temperature?.toFixed(1) || '22.5'}°C
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMonitor;
