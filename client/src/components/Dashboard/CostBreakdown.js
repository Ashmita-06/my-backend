import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CostBreakdown = ({ data }) => {
  const chartData = {
    labels: ['Fuel', 'Operations', 'Maintenance', 'Carbon Tax', 'Other'],
    datasets: [
      {
        data: [
          data?.fuel?.amount || 0,
          data?.operation?.amount || 0,
          data?.maintenance?.amount || 0,
          data?.carbonTax?.amount || 0,
          (data?.total?.amount || 0) * 0.05 // 5% for other costs
        ],
        backgroundColor: [
          '#ef4444', // Red for fuel
          '#f59e0b', // Amber for operations
          '#3b82f6', // Blue for maintenance
          '#8b5cf6', // Purple for carbon tax
          '#6b7280'  // Gray for other
        ],
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: $${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%'
  };

  const totalCost = data?.total?.amount || 0;
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">
              Cost Breakdown
            </h3>
            <p className="text-sm text-secondary-600">
              Operational cost distribution
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-secondary-900">
              {formatCurrency(totalCost)}
            </p>
            <p className="text-sm text-secondary-600">Total Cost</p>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="h-80 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <Doughnut data={chartData} options={options} />
          </div>
        </div>
        
        {/* Cost details */}
        <div className="mt-6 space-y-3">
          {[
            { label: 'Fuel', amount: data?.fuel?.amount || 0, color: 'bg-error-500', percentage: data?.fuel?.percentage || 0 },
            { label: 'Operations', amount: data?.operation?.amount || 0, color: 'bg-warning-500', percentage: data?.operation?.percentage || 0 },
            { label: 'Maintenance', amount: data?.maintenance?.amount || 0, color: 'bg-primary-500', percentage: data?.maintenance?.percentage || 0 },
            { label: 'Carbon Tax', amount: data?.carbonTax?.amount || 0, color: 'bg-purple-500', percentage: data?.carbonTax?.percentage || 0 }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-sm font-medium text-secondary-700">
                  {item.label}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-secondary-900">
                  {formatCurrency(item.amount)}
                </span>
                <span className="text-xs text-secondary-600 ml-2">
                  ({item.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CostBreakdown;
