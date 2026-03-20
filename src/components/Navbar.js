import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './components';

export default function Navbar () {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-[15px] font-semibold tracking-tight text-black">
          Yepper <span className="text-gray-400">×</span> Business
        </Link>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link to="/analysis" className="hidden sm:block">
            <Button 
              variant='ghost'
              className="h-9 flex items-center space-x-2 focus:outline-none focus:ring-0"
            >
              <span>Campaigns Analysis</span>
            </Button>
          </Link>

          <Link to="/analysis" className="sm:hidden">
            <Button 
              variant='ghost'
              className="h-9 px-2 flex items-center focus:outline-none focus:ring-0"
            >
              <span className="text-sm">Campaigns Analysis</span>
            </Button>
          </Link>
          
        </div>
      </div>
    </nav>
  );
};
