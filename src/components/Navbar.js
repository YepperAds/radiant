import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar () {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-[15px] font-semibold tracking-tight text-black">
          Radiant <span className="text-gray-400">×</span> Yepper
        </Link>
      </div>
    </nav>
  );
};
