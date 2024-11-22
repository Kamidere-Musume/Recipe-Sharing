import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/; // Minimum 8 characters, at least one letter and one number
    return passwordRegex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long and contain both letters and numbers.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        navigate("/login");
      } else {
        setError(data.message); // Django message for invalid username/password or other errors
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Error during registration:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-transparent">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Create an Account</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleRegister} className="space-y-6" autoComplete="off">
          <div>
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

          <div>
            <label htmlFor="email" className="block text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border-b-2 border-gray-600 text-white bg-transparent focus:border-indigo-500 focus:outline-none transition-all duration-300"
              required
              autoComplete="off"
            />
          </div>

          <div>
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

          <div>
            <label htmlFor="password_confirm" className="block text-gray-300">Confirm Password</label>
            <input
              type="password"
              id="password_confirm"
              name="password_confirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full px-4 py-2 border-b-2 border-gray-600 text-white bg-transparent focus:border-indigo-500 focus:outline-none transition-all duration-300"
              required
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md mt-6 hover:bg-indigo-700 focus:outline-none transition-all duration-300 ease-in-out"
          >
            Register
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-300">Already have an account? <a href="/login" className="text-blue-400 hover:underline">Login here</a></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
