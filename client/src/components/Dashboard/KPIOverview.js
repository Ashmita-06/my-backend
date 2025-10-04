import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  Zap, 
  Leaf,
  Target,
  Clock
} from 'lucide-react';

const KPIOverview = ({ data }) => {
  const kpis = [
    {
      title: 'Total CO2 Emissions',
      value: data?.environmental?.totalCO2 || 0,
      unit: 'kg',
      change: -12.5,
      icon: Activity,
      color: 'text-error-600',
      bgColor: 'bg-error-50',
      borderColor: 'border-error-200'
    },
    {
      title: 'Carbon Intensity',
      value: data?.environmental?.carbonIntensity || 0,
      unit: 'kg CO2/MWh',
      change: -8.2,
      icon: Target,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
      borderColor: 'border-warning-200'
    },
    {
      title: 'Efficiency',
      value: data?.environmental?.efficiency || 0,
      unit: '%',
      change: 5.3,
      icon: Zap,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
      borderColor: 'border-success-200'
    },
    {
      title: 'Cost Savings',
      value: data?.financial?.totalSavings || 0,
      unit: '$',
      change: 15.7,
      icon: DollarSign,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200'
    },
    {
      title: 'Power Generated',
      value: data?.operational?.totalPower || 0,
      unit: 'MWh',
      change: 2.1,
      icon: TrendingUp,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
      borderColor: 'border-secondary-200'
    },
    {
      title: 'Emission Reduction',
      value: data?.environmental?.emissionReduction || 0,
      unit: '%',
      change: 18.4,
      icon: Leaf,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
      borderColor: 'border-success-200'
    }
  ];

  const formatValue = (value, unit) => {
    if (unit === '$') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    
    return value.toFixed(1);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`
            bg-white rounded-lg border ${kpi.borderColor} p-6
            hover:shadow-md transition-shadow duration-200
          `}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <div className="flex items-center gap-1">
              {kpi.change > 0 ? (
                <TrendingUp className="w-4 h-4 text-success-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-error-600" />
              )}
              <span className={`text-sm font-medium ${
                kpi.change > 0 ? 'text-success-600' : 'text-error-600'
              }`}>
                {Math.abs(kpi.change)}%
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-bold text-secondary-900">
              {formatValue(kpi.value, kpi.unit)}
              {kpi.unit !== '$' && <span className="text-sm font-normal text-secondary-600 ml-1">{kpi.unit}</span>}
            </p>
            <p className="text-sm text-secondary-600">
              {kpi.title}
            </p>
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              kpi.change > 0 ? 'bg-success-500' : 'bg-error-500'
            }`} />
            <span className="text-xs text-secondary-500">
              {kpi.change > 0 ? 'Improving' : 'Needs attention'}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default KPIOverview;
