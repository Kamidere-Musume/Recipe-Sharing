import React, { useState, useEffect } from "react";
import { Route, Routes, BrowserRouter as Router, Navigate } from "react-router-dom";
import './index.css'; // Tailwind CSS styles
import Navbar from './components/Navbar';
import RecipesPage from './pages/RecipesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import RecipeDetails from './pages/RecipeDetails';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Footer from "./components/Footer";

function App() {
  const [user, setUser] = useState(null);

  // Check if the user is logged in by checking localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser); // Set user data if valid
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user"); // Clear invalid data from localStorage
      }
    }
  }, []);

  // Helper function for protected routes
  const ProtectedRoute = ({ element }) => {
    return user ? element : <Navigate to="/login" />;
  };

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
        {/* Homepage Route */}
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />

        {/* Login and Register Routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login loginUser={loginUser} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />

        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
        <Route path="/about" element={<ProtectedRoute element={<AboutPage />} />} />
        <Route path="/contact" element={<ProtectedRoute element={<ContactPage />} />} />
        <Route path="/recipe-details" element={<ProtectedRoute element={<RecipeDetails />} />} />
        <Route path="/recipes/:page" element={<ProtectedRoute element={<RecipesPage user={user} />} />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
