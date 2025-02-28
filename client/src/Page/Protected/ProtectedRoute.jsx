// ProtectedRoute.jsx
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase"; // Adjust the path as necessary
import { Navigate, useLocation } from "react-router-dom";

/**
 * @param {Array<string>} allowedEmails - Array of emails permitted for this route.
 * @param {React.ReactNode} children - The protected component(s).
 */
const ProtectedRoute = ({ allowedEmails = [], children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for Firebase authentication state changes.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Clean up the listener on unmount.
    return () => unsubscribe();
  }, []);

  // While checking the authentication state, show a loading indicator.
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user is authenticated, redirect to login.
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If the user is authenticated but not permitted (email not in allowedEmails),
  // redirect to login with an error message.
  if (!allowedEmails.includes(user.email)) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          error:
            "You are not permitted to enter this area. Please contact your administrator and login with an appropriate account."
        }}
      />
    );
  }

  // If all checks pass, render the protected content.
  return children;
};

export default ProtectedRoute;
