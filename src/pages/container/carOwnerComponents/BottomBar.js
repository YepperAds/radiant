// BottomBar.js
import React from 'react';

function BottomBar({ selectedCount, totalCount, handleContinue }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm">
            <span className="font-semibold text-black text-base sm:text-lg">
              {selectedCount} platform{selectedCount !== 1 ? 's' : ''} selected
            </span>
            <span className="text-gray-500 ml-2 hidden sm:inline">
              {selectedCount === totalCount ? 'All platforms selected' : 'Ready to continue'}
            </span>
          </div>
          <button
            onClick={handleContinue}
            disabled={selectedCount === 0}
            className={`px-6 sm:px-10 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-lg transition-all shadow-md hover:shadow-lg ${
              selectedCount === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default BottomBar;