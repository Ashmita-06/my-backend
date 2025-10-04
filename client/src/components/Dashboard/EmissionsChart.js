import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const EmissionsChart = ({ data, plant }) => {
  const chartData = {
    labels: data?.map(item => {
      const date = new Date(item._id.year, item._id.month - 1, item._id.day);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }) || [],
    datasets: [
      {
        label: 'CO2 Emissions (kg)',
        data: data?.map(item => item.co2) || [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Power Generation (MWh)',
        data: data?.map(item => item.power) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          }
        }
      },
      title: {
        display: true,
        text: `Emissions vs Power Generation - ${plant?.name || 'Plant'}`,
        font: {
          size: 16,
          weight: 'bold',
          family: 'Inter, sans-serif'
        },
        color: '#1f2937',
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        intersect: false,
        mode: 'index'
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          },
          color: '#6b7280'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'CO2 Emissions (kg)',
          font: {
            size: 12,
            weight: 'bold',
            family: 'Inter, sans-serif'
          },
          color: '#ef4444'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          },
          color: '#6b7280'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Power Generation (MWh)',
          font: {
            size: 12,
            weight: 'bold',
            family: 'Inter, sans-serif'
          },
          color: '#22c55e'
        },
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          },
          color: '#6b7280'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      point: {
        hoverBackgroundColor: '#fff'
      }
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">
              Emissions Trend
            </h3>
            <p className="text-sm text-secondary-600">
              Real-time CO2 emissions and power generation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-error-500 rounded-full"></div>
            <span className="text-sm text-secondary-600">CO2</span>
            <div className="w-3 h-3 bg-success-500 rounded-full ml-2"></div>
            <span className="text-sm text-secondary-600">Power</span>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="h-80">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default EmissionsChart;
