// Navbar.js
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Mail, ChevronDown } from 'lucide-react';
import { Button } from './components';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-12">
          <Link to="/" className="text-lg sm:text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
            Yepper
          </Link>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* <Link to="/review" className="hidden sm:block">
              <Button 
                variant='ghost'
                className="h-9 flex items-center space-x-2 focus:outline-none focus:ring-0"
              >
                <span>Your Campaigns</span>
              </Button>
            </Link>

            <Link to="/select-platforms">
              <Button 
                variant='ghost'
                className="h-9 flex items-center space-x-2 focus:outline-none focus:ring-0"
              >
                <span>platforms</span>
              </Button>
            </Link> */}

            {/* <Link to="/review" className="sm:hidden">
              <Button 
                variant='ghost'
                className="h-9 px-2 flex items-center focus:outline-none focus:ring-0"
              >
                <span className="text-sm">Campaigns</span>
              </Button>
            </Link> */}
            
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;