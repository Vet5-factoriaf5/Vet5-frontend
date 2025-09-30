import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import HomeTest from "./pages/homeTest/HomeTest";
import LoginTest from "./pages/LoginPageTest";
import RegisterTest from "./pages/RegisterPageTest";

function App() {
  return (
    <Routes>
      {/* Route for the "Home Test Page" at the root URL */}
      <Route path="/" element={<HomeTest />} />

      {/* Route for the "Login Form Test" */}
      <Route path="/login" element={<LoginTest />} />

      {/* Route for the "Registration Form Test" */}
      <Route path="/register" element={<RegisterTest />} />

      {/* Optional: Simple 404 page */}
      <Route
        path="*"
        element={
          <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>404</h1>
            <p>Page Not Found</p>
            <Link to="/">Go Home</Link>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
