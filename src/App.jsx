import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Nav from "./components/nav/Nav";
import Footer from "./components/footer/Footer";
import ModalComponent from "./components/modal/Modal";
import LoginModal from "./components/loginmodal/LoginModal";
import "./App.css";

function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Estado que contiene todos los usuarios registrados
  const [users, setUsers] = useState([
    {
      name: "Juan González",
      dni: "12345678A",
      email: "juan@gmai.com",
      phone: "627123456",
      password: "?Jg12345"
    }
  ]);

  const handleRegister = (newUserData) => {
    setUsers((prevUsers) => {
      console.log("Nuevo usuario registrado:", newUserData);
      return [...prevUsers, newUserData];
    });
  };

  return (
    <Router>
      <div className="app-container">
        <Nav onLoginClick={() => setIsLoginOpen(true)} />
        <Routes>
          <Route path="/" element={<Home onRegisterClick={() => setIsRegisterOpen(true)} />} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
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
