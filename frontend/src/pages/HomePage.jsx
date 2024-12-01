import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";

const HomePage = () => {
  const navigate = useNavigate();
  const [tekks, setTekks] = useState([]); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/tekks`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.tekks)) {
          setTekks(data.tekks);
        } else {
          setError("Unexpected data format");
        }
      })
      .catch((err) => {
        setError(`Error: ${err.message}`);
        console.error("Error fetching tekks:", err);
      })
      .finally(() => setLoading(false));
  }, [])

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black min-h-screen text-white">
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

      {/* Recipes Grid */}
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Featured Recipes</h1>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {tekks.slice(0,3).map((tekk) => (
            <li
              key={tekk.id}
              className="hover:cursor-pointer hover:-translate-y-1 transition-transform transform"
            >
              <div className="relative group rounded-lg overflow-hidden shadow-lg">
                <img
                  src={tekk.url || defaultImage}
                  alt={tekk.title}
                  className="w-full h-80 object-cover rounded-lg transition-all duration-300 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                  onClick={() =>
                    navigate("/recipe-details", {
                      state: { tekk, image: tekk.url || defaultImage, page: 1 },
                    })
                  }
                >
                  <p className="text-white text-lg font-medium">Click to View Recipe</p>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-center text-white mt-3 truncate">
                {tekk.title}
              </h2>
            </li>
          ))}
        </ul>
      </div>

      {/* Why Choose Us Section */}
      <section className="py-8 bg-cover bg-center relative">
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
