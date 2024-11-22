import React, { useState, useEffect } from "react";
import { Route, Routes, BrowserRouter as Router, Navigate } from "react-router-dom";
import './index.css'; // Tailwind CSS styles
import Navbar from './components/Navbar';
import RecipesPage from './pages/RecipesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SubmitRecipePage from './pages/SubmitRecipePage';
import HomePage from './pages/HomePage';
import RecipeDetails from './pages/RecipeDetails';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';

function App() {
  const [user, setUser] = useState(null);

  // Check if the user is logged in by checking localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // Set user data if valid
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user"); // Clear invalid data from localStorage
      }
    }
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Save user to localStorage
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user"); // Remove user from localStorage on logout
  };

  return (
    <div>
      <Navbar user={user} logoutUser={logoutUser} />
      <Routes>
        {/* Redirect to homepage if user is logged in */}
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />

        {/* If already logged in, redirect to homepage from login/register */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login loginUser={loginUser} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />

        {/* Protected Routes */}
        <Route path="/home" element={user ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/about" element={user ? <AboutPage /> : <Navigate to="/login" />} />
        <Route path="/contact" element={user ? <ContactPage /> : <Navigate to="/login" />} />
        <Route path="/submit-recipe" element={user ? <SubmitRecipePage /> : <Navigate to="/login" />} />
        <Route path="/recipe-details" element={user ? <RecipeDetails /> : <Navigate to="/login" />} />
        <Route path="/recipes/:page" element={user ? <RecipesPage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
