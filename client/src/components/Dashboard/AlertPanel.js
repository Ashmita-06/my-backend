import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  X,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const AlertPanel = () => {
  const alerts = [
    {
      id: 1,
      type: 'critical',
      title: 'High CO2 Emissions',
      message: 'Plant A emissions exceeded 1,200 kg CO2/MWh threshold',
      timestamp: '2 minutes ago',
      action: 'Review combustion parameters',
      icon: AlertTriangle,
      color: 'text-error-600',
      bgColor: 'bg-error-50',
      borderColor: 'border-error-200'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Efficiency Drop',
      message: 'Thermal efficiency decreased by 3.2% in the last hour',
      timestamp: '15 minutes ago',
      action: 'Check boiler conditions',
      icon: TrendingDown,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
      borderColor: 'border-warning-200'
    },
    {
      id: 3,
      type: 'info',
      title: 'Optimization Available',
      message: 'AI has identified 3 new cost reduction opportunities',
      timestamp: '1 hour ago',
      action: 'Review recommendations',
      icon: TrendingUp,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200'
    }
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return AlertTriangle;
      case 'warning':
        return AlertCircle;
      case 'info':
        return CheckCircle;
      default:
        return AlertCircle;
    }
  };

  const getAlertSeverity = (type) => {
    switch (type) {
      case 'critical':
        return 'Critical';
      case 'warning':
        return 'Warning';
      case 'info':
        return 'Info';
      default:
        return 'Alert';
    }
  };

  return (
    <div className="space-y-4">
      {alerts.map((alert, index) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`
            border rounded-lg p-4 ${alert.borderColor} ${alert.bgColor}
            hover:shadow-md transition-shadow duration-200
          `}
        >
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`p-2 rounded-lg ${alert.bgColor}`}>
              <alert.icon className={`w-5 h-5 ${alert.color}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-secondary-900">
                      {alert.title}
                    </h4>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${alert.color} ${alert.bgColor}
                    `}>
                      {getAlertSeverity(alert.type)}
                    </span>
                  </div>
                  <p className="text-sm text-secondary-600 mb-2">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-secondary-500">
                    <span>{alert.timestamp}</span>
                    <span>•</span>
                    <span className="font-medium">{alert.action}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <button className="btn btn-primary btn-sm">
                    {alert.type === 'critical' ? 'Take Action' : 'View Details'}
                  </button>
                  <button className="p-1 rounded-md hover:bg-secondary-100 transition-colors">
                    <X className="w-4 h-4 text-secondary-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Summary */}
      <div className="bg-secondary-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-error-500 rounded-full"></div>
              <span className="text-sm text-secondary-700">1 Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
              <span className="text-sm text-secondary-700">1 Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              <span className="text-sm text-secondary-700">1 Info</span>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm">
            Manage Alerts
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertPanel;
