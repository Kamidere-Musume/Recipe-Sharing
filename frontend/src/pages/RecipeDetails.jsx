import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function RecipeDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tekk, image, page } = location.state || {};  // relatedRecipes is no longer passed here

  const [recommendedRecipes, setRecommendedRecipes] = useState({});
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  const fetchRecommendations = async (currentRecipeId) => {
    try {
      setLoadingRecommendations(true);
      const response = await fetch(`http://127.0.0.1:8000/api/tekks/recommendations/${currentRecipeId}`);
      
      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations: ${response.statusText}`);
      }
  
      // Check if the response is JSON
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setRecommendedRecipes(data);
        console.log(recommendedRecipes)
      } else {
        const textResponse = await response.text();
        console.error("Unexpected response type:", textResponse);
        throw new Error("Expected JSON but got non-JSON response.");
      }
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      setRecommendedRecipes([]);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    console.log("Updated recommendations:", recommendedRecipes);
  }, [recommendedRecipes]);
  
  // Fetch recommendations on mount or when recipe changes
  useEffect(() => {
    if (tekk?.id) { 
      fetchRecommendations(tekk.id);
    }
  }, [tekk?.id]);  
  

  if (!tekk) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-500 text-xl">No recipe data found.</p>
        <button
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg mt-6 hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => navigate("/")}
        >
          Back to Recipes
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black min-h-screen p-6 text-white">
      <button
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg mb-8 hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
        onClick={() => navigate(`/recipes/${page}`)} // Navigate back to the previous page
      >
        Back to Recipes
      </button>

      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black shadow-xl rounded-lg p-6 max-w-4xl mx-auto">
        {/* Recipe Image */}
        <img
          src={image}
          alt={tekk.title}
          className="w-full h-96 object-cover rounded-lg mb-6 shadow-md"
        />

        {/* Recipe Title */}
        <h1 className="text-4xl font-bold text-center mb-4">{tekk.title}</h1>

        {/* Ingredients Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg text-gray-200">
            {Array.isArray(tekk.ingredients) && tekk.ingredients.length > 0 ? (
              tekk.ingredients.map((ingredient, index) => (
                <li key={index} className="transition duration-300 ease-in-out">
                  {ingredient.text}
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500">No ingredients available</p>
            )}
          </ul>
        </div>

        {/* Instructions Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal pl-6 space-y-2 text-lg text-gray-200">
            {Array.isArray(tekk.instructions) && tekk.instructions.length > 0 ? (
              tekk.instructions.map((instruction, index) => (
                <li key={index} className="transition duration-300 ease-in-out">
                  {instruction.text}
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500">No instructions available</p>
            )}
          </ol>
        </div>

        {/* Recipe Tags Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Tags</h2>
          <div className="flex space-x-4">
            {tekk.tags?.map((tag, index) => (
              <span key={index} className="bg-indigo-600 text-white py-2 px-4 rounded-lg">{tag}</span>
            ))}
          </div>
        </div>

        {/* Recipe Rating Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Rate This Recipe</h2>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-400 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 17.27l4.15 2.18-1.06-4.72 3.67-3.38-4.86-.42L12 2 9.07 11.93l-4.86.42 3.67 3.38-1.06 4.72L12 17.27z"
                />
              </svg>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Comments</h2>
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-lg text-gray-200">John Doe: This recipe is amazing! My family loved it.</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-lg text-gray-200">Jane Smith: Easy to follow and delicious!</p>
            </div>
          </div>
        </div>

        {/* You May Also Like Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loadingRecommendations ? (
              <p className="text-gray-500">Loading recommendations...</p>
            ) : (
              recommendedRecipes["recommended_recipes"].length > 0 ? (
                recommendedRecipes["recommended_recipes"].map((recipe) => (
                  <div key={recipe.id} className="bg-gray-700 p-4 rounded-lg">
                    <img
                      src={recipe.url}
                      alt={recipe.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      onClick={() => {navigate("/recipe-details", { state: { tekk: recipe, image: recipe.url } })
                      window.scrollTo(0,0)
                    }}
                    />
                    <h3 className="text-xl font-bold text-gray-200">{recipe.title}</h3>
                    <p className="text-gray-300">{recipe.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recommendations available</p>
              )
            )}
          </div>
        </div>

        {/* Social Media Sharing */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Share This Recipe</h2>
          <div className="flex space-x-4">
            <a
              href="#"
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Facebook
            </a>
            <a
              href="#"
              className="bg-blue-400 text-white py-2 px-4 rounded-lg hover:bg-blue-500"
            >
              Twitter
            </a>
            <a
              href="#"
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
            >
              Pinterest
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;
