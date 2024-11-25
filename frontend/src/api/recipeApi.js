const API_BASE_URL = "/api/recipes"; // Use relative path
 // Make sure this matches your backend server's URL

// Fetch all recipes
export const fetchRecipes = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};