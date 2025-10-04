import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter, Search } from 'lucide-react';

const EmissionsFilters = ({ filters, onFilterChange }) => {
  const handleChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-secondary-900">Filters</h3>
        </div>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Plant Selection */}
          <div>
            <label className="form-label">Plant</label>
            <select
              value={filters.plantId}
              onChange={(e) => handleChange('plantId', e.target.value)}
              className="form-input form-select"
            >
              <option value="">All Plants</option>
              <option value="plant-1">Plant A - Coal</option>
              <option value="plant-2">Plant B - Natural Gas</option>
              <option value="plant-3">Plant C - Oil</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="form-label">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="form-input"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="form-label">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="form-input"
            />
          </div>

          {/* Page Size */}
          <div>
            <label className="form-label">Records per page</label>
            <select
              value={filters.limit}
              onChange={(e) => handleChange('limit', parseInt(e.target.value))}
              className="form-input form-select"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => onFilterChange({
              plantId: '',
              startDate: '',
              endDate: '',
              page: 1,
              limit: 50
            })}
            className="btn btn-secondary btn-sm"
          >
            Clear Filters
          </button>
          
          <div className="flex items-center gap-2">
            <button className="btn btn-primary btn-sm">
              <Search className="w-4 h-4 mr-1" />
              Search
            </button>
            <button className="btn btn-secondary btn-sm">
              <Calendar className="w-4 h-4 mr-1" />
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmissionsFilters;
