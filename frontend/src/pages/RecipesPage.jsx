import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import debounce from "lodash.debounce";

function RecipePage() {
  const { page } = useParams(); // Get the current page from the URL
  const navigate = useNavigate();
  const [tekks, setTekks] = useState([]); // All recipes loaded in memory
  const [filteredTekks, setFilteredTekks] = useState([]); // Filtered recipes based on search query
  const [error, setError] = useState(null);
  const [pages, setPages] = useState(parseInt(page || 1, 10)); // Initialize with the URL page or 1
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const defaultImage = "https://via.placeholder.com/150"; // Placeholder image

  // Sync pages state with the URL
  useEffect(() => {
    setPages(parseInt(page || 1, 10)); // Update the page state if the URL changes
  }, [page]);

  // Fetch recipes from the API whenever `pages` changes
 useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/tekks?page=${pages}&search=${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.tekks)) {
          setTekks(data.tekks);
          setFilteredTekks(data.tekks); // Initially show all recipes
          setHasMore(data.tekks.length > 0); // Check if there are more recipes
        } else {
          setError("Unexpected data format");
        }
      })
      .catch((err) => {
        setError(`Error: ${err.message}`);
        console.error("Error fetching tekks:", err);
      })
      .finally(() => setLoading(false));
}, [pages, searchQuery]); // Add searchQuery as a dependency to refetch data when search query changes

  // Debounced search handler
const handleSearch = debounce((query) => {
  setSearchQuery(query);
  // Filter recipes based on search query
  if (query.trim() === "") {
    setFilteredTekks(tekks); // Show all recipes if query is empty
  } else {
    const filtered = [];
    const seen = new Set(); // To track seen recipe IDs

    tekks.forEach((tekk) => {
      if (tekk.title.toLowerCase().includes(query.toLowerCase()) && !seen.has(tekk.id)) {
        filtered.push(tekk);
        seen.add(tekk.id); // Mark this recipe ID as seen
      }
    });

    setFilteredTekks(filtered); // Update filtered recipes
  }
}, 300); // 300ms delay to limit the number of times the function is triggered // 300ms delay to limit the number of times the function is triggered

  // Handle search input change
  const handleSearchChange = (event) => {
    handleSearch(event.target.value); // Trigger debounced search
  };

  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white">
      {/* Page Header */}
      <div
        className="mb-6 text-center flex flex-col justify-center items-center h-56 bg-cover bg-center rounded-lg shadow-lg"
        style={{
          backgroundImage: 'url("/src/assets/recipe.jpg")',
        }}
      >
        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
          Explore Recipes
        </h1>
        <p className="text-gray-200 mt-2 text-lg font-light">
          Discover and create your favorite dishes!
        </p>
      </div>

      {/* Title before recipes */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-white">Browse Our Delicious Recipes</h2>
        <p className="text-gray-300 text-lg mt-2">Choose from a wide variety of tasty dishes!</p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search recipes..."
          onChange={handleSearchChange}
          className="w-1/2 p-3 rounded-lg text-lg text-white bg-transparent placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 shadow-md"
        />
      </div>
      
      {/* Recipes Grid */}
      <div className="p-6">
        {loading ? (
          <p className="text-center text-gray-200 text-lg">Loading...</p>
        ) : filteredTekks.length === 0 && !searchQuery ? (
          <p className="text-center text-gray-200 text-lg">No Recipes found</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredTekks.map((tekk) => (
              <li
                key={tekk.id}
                className="hover:cursor-pointer hover:-translate-y-1 transition-transform transform"
                onClick={() =>
                  navigate("/recipe-details", {
                    state: { tekk, image: tekk.url || defaultImage, page: pages },
                  })
                }
              >
                <div className="relative group rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={tekk.url || defaultImage}
                    alt={tekk.title}
                    className="w-full h-80 object-cover rounded-lg transition-all duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <p className="text-white text-lg font-medium">Click to View Recipe</p>
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-center text-white mt-3 truncate">
                  {tekk.title}
                </h2>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pagination Buttons */}
      <div className="flex justify-between mt-10 p-4">
        {/* Previous Button */}
        <button
          className={`px-6 py-3 rounded-lg font-semibold transition-transform transform ${
            pages <= 1 || loading
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95"
          }`}
          onClick={() => navigate(`/recipes/${pages - 1}`)}
          disabled={pages <= 1 || loading}
        >
          {loading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            "Previous"
          )}
        </button>

        {/* Next Button */}
        <button
          className={`px-6 py-3 rounded-lg font-semibold transition-transform transform ${
            !hasMore || loading
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95"
          }`}
          onClick={() => navigate(`/recipes/${pages + 1}`)}
          disabled={!hasMore || loading}
        >
          {loading ? (
            <span className="animate-pulse">Loading...</span>
          ) : hasMore ? (
            "Next"
          ) : (
            "No More Recipes"
          )}
        </button>
      </div>
    </div>
  );
}

export default RecipePage;
