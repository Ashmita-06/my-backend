import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'emission',
      title: 'CO2 emissions exceeded threshold',
      description: 'Plant A emissions reached 1,250 kg CO2/MWh',
      timestamp: '2 minutes ago',
      status: 'warning',
      icon: AlertTriangle,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50'
    },
    {
      id: 2,
      type: 'optimization',
      title: 'New optimization recommendation',
      description: 'AI suggests boiler efficiency improvement',
      timestamp: '15 minutes ago',
      status: 'info',
      icon: TrendingUp,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      id: 3,
      type: 'maintenance',
      title: 'Maintenance completed',
      description: 'Turbine inspection and cleaning finished',
      timestamp: '1 hour ago',
      status: 'success',
      icon: CheckCircle,
      color: 'text-success-600',
      bgColor: 'bg-success-50'
    },
    {
      id: 4,
      type: 'efficiency',
      title: 'Efficiency improved',
      description: 'Thermal efficiency increased by 2.3%',
      timestamp: '2 hours ago',
      status: 'success',
      icon: Zap,
      color: 'text-success-600',
      bgColor: 'bg-success-50'
    },
    {
      id: 5,
      type: 'scheduled',
      title: 'Scheduled maintenance',
      description: 'Boiler cleaning scheduled for tomorrow',
      timestamp: '3 hours ago',
      status: 'info',
      icon: Clock,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'emission':
        return Activity;
      case 'optimization':
        return TrendingUp;
      case 'maintenance':
        return CheckCircle;
      case 'efficiency':
        return Zap;
      case 'scheduled':
        return Clock;
      default:
        return Activity;
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-secondary-900">
          Recent Activity
        </h3>
        <p className="text-sm text-secondary-600">
          Latest updates from your plant operations
        </p>
      </div>
      <div className="card-body">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-secondary-50 transition-colors duration-200"
            >
              {/* Icon */}
              <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                <activity.icon className={`w-5 h-5 ${activity.color}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-secondary-900">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-secondary-600 mt-1">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-secondary-500 ml-4 flex-shrink-0">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View all button */}
        <div className="mt-6 pt-4 border-t border-secondary-200">
          <button className="w-full btn btn-secondary">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
