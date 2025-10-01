import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Nav from "./components/nav/Nav";
import Footer from "./components/footer/Footer";
import ModalComponent from "./components/modal/Modal";
import LoginModal from "./components/loginmodal/LoginModal";
import { login as loginApi, register as registerApi, logout as logoutApi } from "./api/authApi";
import UserDashboard from "./pages/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import "./App.css";

// Componente de ruta privada
const PrivateRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  if (!user.username) return <Navigate to="/" />;
  if (requiredRole && !user.roles?.includes(requiredRole)) return <Navigate to="/" />;
  return children;
};

function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleRegister = async (newUserData) => {
    try {
      console.log("Registrando usuario:", newUserData);
      const response = await registerApi(newUserData);
      console.log("Registro exitoso:", response);
      setIsRegisterOpen(false);
      alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
    } catch (error) {
      console.error("Error durante el registro:", error);
      alert("Error al registrar: " + error.message);
    }
  };

  const handleLogin = async (identifier, password) => {
    try {
      console.log("Intentando login con:", identifier);
      const response = await loginApi(identifier, password);
      console.log("Login exitoso:", response);
      
      const userData = {
        username: response.username,
        roles: [response.roles],
        isAuthenticated: true
      };
      
      setCurrentUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setIsLoginOpen(false);
      
      // Redirigir según el rol
      if (response.roles === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
      
      alert("¡Login exitoso! Bienvenido " + response.username);
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error: " + (error.response?.data?.message || "Credenciales incorrectas"));
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      setCurrentUser(null);
      localStorage.removeItem("user");
      alert("Sesión cerrada");
      navigate('/');
    }
  };

  return (
    <div className="app-container">
      <Nav 
        onLoginClick={() => setIsLoginOpen(true)} 
        onLogoutClick={handleLogout} 
        isAuthenticated={!!currentUser} 
      />
      
      <Routes>
        <Route path="/" element={<Home onRegisterClick={() => setIsRegisterOpen(true)} />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="ROLE_ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/user"
          element={
            <PrivateRoute requiredRole="ROLE_USER">
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
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
        onLogin={handleLogin}
      />
    </div>
  );
}

// Envolver App con Router
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}