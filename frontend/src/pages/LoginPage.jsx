import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ loginUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        loginUser(data.user);
        navigate("/home");
      } else {
        setError(data.message); // Display Django message (incorrect username or password)
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Error during login:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-transparent">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Login</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-gray-300">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border-b-2 border-gray-600 text-white bg-transparent focus:border-indigo-500 focus:outline-none transition-all duration-300"
              required
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border-b-2 border-gray-600 text-white bg-transparent focus:border-indigo-500 focus:outline-none transition-all duration-300"
              required
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-indigo-700 focus:outline-none transition duration-300 ease-in-out"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-300">Don't have an account? <a href="/register" className="text-blue-400 hover:underline">Sign up</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
