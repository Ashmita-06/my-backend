import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Activity, 
  TrendingUp, 
  DollarSign, 
  MessageCircle, 
  Info,
  X,
  BarChart3,
  Zap,
  Leaf
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
      description: 'Overview and KPIs'
    },
    {
      name: 'Emissions',
      href: '/emissions',
      icon: Activity,
      description: 'Real-time emissions monitoring'
    },
    {
      name: 'Optimization',
      href: '/optimization',
      icon: TrendingUp,
      description: 'AI-powered recommendations'
    },
    {
      name: 'Cost Reduction',
      href: '/cost-reduction',
      icon: DollarSign,
      description: 'Financial optimization'
    },
    {
      name: 'AI Assistant',
      href: '/chatbot',
      icon: MessageCircle,
      description: 'Chat with AI expert'
    },
    {
      name: 'Information',
      href: '/info',
      icon: Info,
      description: 'Educational resources'
    }
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white border-r border-secondary-200
          flex flex-col lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-secondary-900">
                CarbonEmission Pro
              </h2>
              <p className="text-xs text-secondary-600">
                AI-Powered Platform
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md hover:bg-secondary-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                    : 'text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-secondary-500'}`} />
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-secondary-500 group-hover:text-secondary-600">
                    {item.description}
                  </div>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="w-2 h-2 bg-primary-600 rounded-full"
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-secondary-200">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-secondary-900">
                  AI Optimization
                </h3>
                <p className="text-xs text-secondary-600">
                  Active recommendations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-secondary-600">
                3 new optimization opportunities
              </span>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
