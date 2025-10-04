import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { costReductionAPI } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import CostReductionOverview from '../components/CostReduction/CostReductionOverview';
import CostOpportunities from '../components/CostReduction/CostOpportunities';
import CostAnalysis from '../components/CostReduction/CostAnalysis';
import FuelOptimization from '../components/CostReduction/FuelOptimization';

const CostReduction = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [plantId] = useState('plant-1'); // In a real app, this would come from context

  const { data: opportunities, isLoading: opportunitiesLoading } = useQuery(
    'cost-opportunities',
    () => costReductionAPI.getOpportunities({ plantId }),
    {
      staleTime: 300000 // 5 minutes
    }
  );

  const { data: analysis, isLoading: analysisLoading } = useQuery(
    'cost-analysis',
    () => costReductionAPI.getAnalysis({ plantId, period: '30d' }),
    {
      staleTime: 300000
    }
  );

  const { data: fuelOptimization, isLoading: fuelLoading } = useQuery(
    'fuel-optimization',
    () => costReductionAPI.getFuelOptimization(plantId),
    {
      staleTime: 300000
    }
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'opportunities', label: 'Opportunities', icon: '💡' },
    { id: 'analysis', label: 'Cost Analysis', icon: '📈' },
    { id: 'fuel', label: 'Fuel Optimization', icon: '⛽' }
  ];

  const isLoading = opportunitiesLoading || analysisLoading || fuelLoading;

  if (isLoading && !opportunities && !analysis) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
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
          Cost Reduction
        </h1>
        <p className="text-secondary-600">
          Optimize operational costs and maximize savings through AI-driven recommendations
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={selectedTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {selectedTab === 'overview' && (
          <CostReductionOverview 
            opportunities={opportunities?.data}
            analysis={analysis?.data}
          />
        )}
        
        {selectedTab === 'opportunities' && (
          <CostOpportunities 
            data={opportunities?.data}
            isLoading={opportunitiesLoading}
          />
        )}
        
        {selectedTab === 'analysis' && (
          <CostAnalysis 
            data={analysis?.data}
            isLoading={analysisLoading}
          />
        )}
        
        {selectedTab === 'fuel' && (
          <FuelOptimization 
            data={fuelOptimization?.data}
            isLoading={fuelLoading}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default CostReduction;
