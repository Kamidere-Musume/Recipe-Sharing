import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, logoutUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close the dropdown if user clicks anywhere outside
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
            {/* Logo */}
            <Link to="/" className="text-3xl font-bold text-white hover:text-gray-400">
              RecipeShare
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-gray-400">Home</Link>
            <Link to="/recipes/1" className="text-white hover:text-gray-400">Recipes</Link>
            <Link to="/about" className="text-white hover:text-gray-400">About</Link>
            <Link to="/contact" className="text-white hover:text-gray-400">Contact</Link>
          </div>

          {/* User Dropdown for Logged-in User */}
          {user ? (
            <div className="hidden md:flex items-center relative" ref={dropdownRef}>
              <button
                className="text-white px-4 py-2 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-full hover:bg-gradient-to-l focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="uppercase text-sm font-semibold">{user.username}</span>
              </button>
              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-opacity-90 bg-black rounded-lg shadow-lg border border-gray-600 transition-all ease-in-out duration-200 opacity-100">
                  <Link
                    to={`/profile/${user.username}`}
                    className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700 rounded-t-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
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
            <div className="hidden md:flex items-center">
              <Link
                to="/login"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Login
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <Link
            to="/"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/recipes/1"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
            onClick={() => setIsOpen(false)}
          >
            Recipes
          </Link>
          <Link
            to="/about"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <Link
            to="/submit-recipe"
            className="block px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={() => setIsOpen(false)}
          >
            Submit Recipe
          </Link>
          {user && (
            <button
              onClick={logoutUser}
              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
