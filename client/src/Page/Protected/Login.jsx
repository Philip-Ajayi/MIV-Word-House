// Login.js
import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { auth } from "../../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine where to redirect after login. Defaults to the admin page.
  const from = location.state?.from?.pathname || "/admin";

  // Get an error message (if any) passed via the location state.
  const locationError = location.state?.error || "";

  // Local component state for email, password, and error messages from sign in attempts.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Combine error from the sign in attempt and from a redirect error (if present).
  const errorMessage = error || locationError;

  // Email/password login handler.
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  // Google login handler.
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {errorMessage && (
          <p className="mb-4 text-red-500 text-center">{errorMessage}</p>
        )}
        {/* Email/Password Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          >
            Login with Email
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600">Or</p>
          <button
            onClick={handleGoogleLogin}
            className="mt-4 flex items-center justify-center w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
          >
            Login with Google
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
