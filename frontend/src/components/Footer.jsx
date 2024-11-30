// src/components/Footer.jsx

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-gray-400 py-6">
    <div className="container mx-auto text-center">
      <p>&copy; 2024 RecipeShare. All rights reserved.</p>
      <div className="flex justify-center space-x-4 mt-4">
        <a href="#" className="hover:text-gray-200">Privacy Policy</a>
        <a href="#" className="hover:text-gray-200">Terms of Service</a>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
