import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Nav from "./components/nav/Nav";
import Footer from "./components/footer/Footer";
import ModalComponent from "./components/modal/Modal";
import LoginModal from "./components/loginmodal/LoginModal";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import "./App.css";

// Componente de ruta privada
const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [users, setUsers] = useState([
    {
      name: "Juan González",
      dni: "12345678A",
      email: "juan@gmai.com",
      phone: "627123456",
      password: "?Jg12345",
      role: "USER"
    }
  ]);

  const handleRegister = (newUserData) => {
    setUsers((prevUsers) => [...prevUsers, newUserData]);
  };

  return (
    <Router>
      <div className="app-container">
        <Nav onLoginClick={() => setIsLoginOpen(true)} />
        <Routes>
          <Route path="/" element={<Home onRegisterClick={() => setIsRegisterOpen(true)} />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute role="ADMIN">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/user"
            element={
              <PrivateRoute role="USER">
                <UserDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
        <Footer />

        <ModalComponent
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onRegister={handleRegister}
        />

        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          users={users}
        />
      </div>
    </Router>
  );
}

export default App;