// SearchBar.js
import React from 'react';

function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search platforms..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-5 py-4 pl-12 border border-gray-200 rounded-sm bg-white text-[15px] focus:outline-none focus:border-black transition-colors"
      />
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}

export default SearchBar;