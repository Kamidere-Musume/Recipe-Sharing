import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function RecipeDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tekk, image, page } = location.state || {}; // relatedRecipes is no longer passed here
  const user = JSON.parse(localStorage.getItem("user"));
  const [recommendedRecipes, setRecommendedRecipes] = useState({});
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  const [rating, setRating] = useState(0); // For storing user rating
  const [newComment, setNewComment] = useState(""); // For user comment input
  const [comments, setComments] = useState([]); // For storing comments

  const fetchRecommendations = async (currentRecipeId) => {
    try {
      setLoadingRecommendations(true);
      const response = await fetch(`http://127.0.0.1:8000/api/tekks/recommendations/${currentRecipeId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations: ${response.statusText}`);
      }
  
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setRecommendedRecipes(data);
        console.log(recommendedRecipes);
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

  useEffect(() => {
    if (tekk?.id) { 
      fetchRecommendations(tekk.id);
    }
  }, [tekk?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      
      const response = await fetch(`http://localhost:8000/api/tekks/reviews/${user.user_id}/${tekk.id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: rating,
          comment: newComment,
        }),
      });

      const result = await response.json();
      console.log(result)
     
      if (result.success) {
       comments.push({user: user.username, text: newComment})
       setNewComment('')
      } else {
        setErrorMessage(result.message);
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error submitting rating and comment:', error);
      setErrorMessage('Something went wrong. Please try again.');
      setSuccessMessage('');
    }
  };
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
        onClick={() => navigate(`/recipes/${page}`)}
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

        {/* Recipe Rating Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Rate This Recipe</h2>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 cursor-pointer ${star <= rating ? "text-yellow-400" : "text-gray-500"}`}
                fill={star <= rating ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={() => setRating(star)}
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
            {comments.map((comment, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <p className="text-lg text-gray-200">{comment.user}: {comment.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-gray-800 text-gray-200 rounded-lg p-4"
              placeholder="Add your comment..."
            ></textarea>
            <button
              onClick={handleSubmit}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg mt-4 hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Submit Comment
            </button>
          </div>
        </div>

        {/* Recommendations */}
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
      </div>
    </div>
  );
}

export default RecipeDetails;
