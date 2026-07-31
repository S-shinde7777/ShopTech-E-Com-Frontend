import React, { useState } from "react";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";

const SearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  sortOption, 
  onSortChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  onResetFilters
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="w-full space-y-4">
      {/* Search Input and Filter Button Bar */}
      <div className="flex items-center gap-3 bg-[#171B26] p-3 rounded-2xl border border-gray-800 shadow-md">
        
        {/* Search Input */}
        <div className="flex items-center flex-1 gap-3 px-4 py-1">
          <FiSearch className="text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search premium products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent outline-none text-white placeholder-gray-500 text-base"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange("")}
              className="text-gray-400 hover:text-white p-1"
            >
              <FiX />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition duration-200 select-none cursor-pointer ${
            showFilters 
              ? "bg-[#4ECDC4] text-black" 
              : "bg-[#F5A623] text-black hover:scale-105"
          }`}
        >
          <FiSliders />
          <span>Filter</span>
        </button>
      </div>

      {/* Expandable Advanced Filters Box */}
      {showFilters && (
        <div className="bg-[#171B26] p-6 rounded-2xl border border-gray-800 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          {/* Sorting */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#4ECDC4] uppercase tracking-wider">Sort Products By</label>
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#F5A623] cursor-pointer"
            >
              <option value="default">Default Features</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated ⭐</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#4ECDC4] uppercase tracking-wider">Price Range (₹)</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => onMinPriceChange(e.target.value)}
                className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-3 py-2 text-white outline-none focus:border-[#F5A623] text-sm"
              />
              <span className="text-gray-600">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => onMaxPriceChange(e.target.value)}
                className="w-full bg-[#0F1117] border border-gray-800 rounded-xl px-3 py-2 text-white outline-none focus:border-[#F5A623] text-sm"
              />
            </div>
          </div>

          {/* Quick Resets */}
          <div className="flex items-end justify-start md:justify-end pb-1">
            <button
              onClick={() => {
                onResetFilters();
                setShowFilters(false);
              }}
              className="px-6 py-2.5 rounded-xl border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 transition font-semibold text-sm cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
