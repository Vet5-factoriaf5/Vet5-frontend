import React, { useState } from "react";
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
  const [users, setUsers] = useState([]);

  return (
    <>
      <Nav onLoginClick={() => setIsLoginOpen(true)} />
      <Home onRegisterClick={() => setIsRegisterOpen(true)} />
      <Footer />

      {/* Modal de registro */}
      <ModalComponent
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        setUsers={setUsers} // Pasamos la función para actualizar usuarios
      />

      {/* Modal de login */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        users={users} // Pasamos los usuarios registrados
      />
    </>
  );
}

export default App;