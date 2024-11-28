import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userResponse = await fetch(`http://localhost:8000/profile/${username}`);
        const userData = await userResponse.json();

        if (userResponse.ok) {
          setUser(userData);
          setRecipes(userData.recipes || []);
        } else {
          alert('Failed to load user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [username]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {user ? (
        <>
          <h1 className="text-3xl font-semibold mb-4">Welcome, {user.username}!</h1>
          <h2 className="text-xl font-semibold mb-4">Your Recipes:</h2>
          {recipes.length > 0 ? (
            <div className="space-y-4">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="bg-gray-100 p-4 rounded-md shadow-md">
                  <h3 className="text-xl font-semibold">{recipe.title}</h3>
                  <p className="text-sm text-gray-700">{recipe.instructions.join(', ')}</p>
                  <a
                    href={recipe.url}
                    className="text-indigo-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Recipe
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p>No recipes found.</p>
          )}
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default UserProfile;
