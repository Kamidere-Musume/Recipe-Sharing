import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const navigate = useNavigate();

  // Fetch featured recipes from the API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/tekks') // Assuming the API endpoint for featured recipes
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.tekks)) {
          setFeaturedRecipes(data.tekks);
        }
      })
      .catch((error) => {
        console.error('Error fetching featured recipes:', error);
      });
  }, []);

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white min-h-screen">
      {/* Hero Section */}
      <section
        className="bg-cover bg-center h-96"
        style={{
          backgroundImage: 'url("/src/assets/homebackground.jpg")'
        }}
      >
        <div className="h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">Delicious Recipes at Your Fingertips</h2>
            <p className="text-xl mb-8 text-gray-200">Explore thousands of recipes from around the world</p>
            <a href="/recipes" className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
              Explore Recipes
            </a>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="container mx-auto px-4 py-12">
        <h3 className="text-3xl font-bold mb-8 text-center text-white">Featured Recipes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredRecipes.length === 0 ? (
            <p className="text-center text-gray-400">No featured recipes available.</p>
          ) : (
            featuredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="shadow-lg rounded-lg overflow-hidden bg-gradient-to-r from-gray-800 via-gray-900 to-black hover:scale-105 transform transition-all duration-300"
                style={{ color: '#f3f4f6' }}
              >
                <img src={recipe.image || '/src/assets/homebackground.jpg'} alt={recipe.title} className="w-full h-48 object-cover"/>
                <div className="p-6">
                  <h4 className="text-2xl font-bold mb-2 text-white">{recipe.title}</h4>
                  <p className="mb-4 text-gray-300">{recipe.description}</p>
                  <button
                    onClick={() => navigate(`/recipe-details/${recipe.id}`)} 
                    className="text-indigo-400 hover:text-indigo-600"
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-gray-400 py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 RecipeShare. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="hover:text-gray-200">Privacy Policy</a>
            <a href="#" className="hover:text-gray-200">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
