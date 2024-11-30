// Navbar Component (same as before, but with a link to profile page)
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, logoutUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-3xl font-bold text-white hover:text-gray-400">
              RecipeShare
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-gray-400">Home</Link>
            <Link to="/recipes/1" className="text-white hover:text-gray-400">Recipes</Link>
            <Link to="/about" className="text-white hover:text-gray-400">About</Link>
            <Link to="/contact" className="text-white hover:text-gray-400">Contact</Link>
          </div>

          {user ? (
            <div className="hidden md:flex items-center relative" ref={dropdownRef}>
              <button
                className="text-white px-4 py-2 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-full hover:bg-gradient-to-l focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="uppercase text-sm font-semibold">{user.username}</span>
              </button>
              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-opacity-90 bg-black rounded-lg shadow-lg border border-gray-600">
                  <button
                    onClick={logoutUser}
                    className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700 rounded-b-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
