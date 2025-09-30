import React from "react";
import { Link } from "react-router-dom";

/**
 * Very simple Home Page component for initial navigation.
 */
function HomeTest() {
  const containerStyle = {
    padding: "20px",
    textAlign: "center",
    fontFamily: "sans-serif",
  };
  const buttonGroupStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "20px", // Space between buttons
    marginTop: "30px",
  };
  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    border: "1px solid #ccc",
    borderRadius: "5px",
  };

  return (
    <div style={containerStyle}>
      <h1>Welcome to the Happy Paws Veterinary Clinic</h1>
      <p>Please log in or register to access the application.</p>

      <div style={buttonGroupStyle}>
        {/* Button to navigate to the Login page */}
        <Link to="/login">
          <button style={buttonStyle}>Go to Login</button>
        </Link>

        {/* Button to navigate to the Registration page */}
        <Link to="/register">
          <button style={buttonStyle}>Go to Registration</button>
        </Link>
      </div>
    </div>
  );
}

export default HomeTest;
