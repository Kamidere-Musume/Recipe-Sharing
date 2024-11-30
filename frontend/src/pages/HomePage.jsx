import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-cover bg-center text-white min-h-screen"
      style={{ backgroundImage: 'url("https://i.pinimg.com/736x/0f/64/8a/0f648a264b8179e13a7c6ff540da4e4f.jpg")' }}
    >
      {/* Hero Section */}
      <section className="h-[50vh] md:h-[60vh] relative flex items-center justify-center bg-black bg-opacity-60">
        <div className="text-center px-8 md:px-16">
          <h2 className="text-5xl font-extrabold mb-4 text-white drop-shadow-lg">Delicious Recipes Await You</h2>
          <p className="text-xl mb-4 text-gray-200">Explore thousands of recipes from different cuisines</p>
          <button
            onClick={() => navigate("/recipes/1")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Explore Recipes
          </button>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section
        className="py-8 bg-cover bg-center relative"
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 p-8">
          <h3 className="text-4xl font-bold mb-6 text-center text-white">Why Choose Us?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg hover:bg-indigo-600 transition duration-300">
              <div className="flex items-center justify-center mb-4">
                <svg className="h-12 w-12 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m4 2a9 9 0 11-7.447-13.447A8.961 8.961 0 0012 3a9 9 0 019 9z" />
                </svg>
              </div>
              <h4 className="text-2xl font-semibold mb-4 text-white">Variety of Recipes</h4>
              <p className="text-gray-300">Explore a wide range of recipes from around the world, whether you're looking for appetizers, main courses, or desserts.</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg hover:bg-indigo-600 transition duration-300">
              <div className="flex items-center justify-center mb-4">
                <svg className="h-12 w-12 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </div>
              <h4 className="text-2xl font-semibold mb-4 text-white">Easy to Follow</h4>
              <p className="text-gray-300">Our step-by-step guides make cooking enjoyable and easy, with clear instructions for every recipe.</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg hover:bg-indigo-600 transition duration-300">
              <div className="flex items-center justify-center mb-4">
                <svg className="h-12 w-12 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h10M7 12h10M7 17h10" />
                </svg>
              </div>
              <h4 className="text-2xl font-semibold mb-4 text-white">Healthy Options</h4>
              <p className="text-gray-300">Find recipes that fit your dietary needs, whether you're vegan, gluten-free, or following a low-carb diet.</p>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default HomePage;
