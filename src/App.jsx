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
  const [users, setUsers] = useState([
    {
      name: "Juan González",
      dni: "12345678A",
      email: "juan@gmai.com",
      phone: "627123456",
      password: "?Jg12345"
    }
  ]);

  // --- CÓDIGO AÑADIDO ---
  // Esta función se encargará de recibir el nuevo usuario desde el ModalComponent
  // y añadirlo a la lista de usuarios.
  const handleRegister = (newUserData) => {
    setUsers((prevUsers) => {
      console.log("Nuevo usuario registrado:", newUserData);
      // Creamos una nueva lista con los usuarios anteriores más el nuevo
      return [...prevUsers, newUserData];
    });
    // El modal se cerrará por su propia lógica interna después de esto.
  };
  // --- FIN DEL CÓDIGO AÑADIDO ---

  return (
    <div className="app-container">
      <Nav onLoginClick={() => setIsLoginOpen(true)} />
      <Home onRegisterClick={() => setIsRegisterOpen(true)} />
      <Footer />

      {/* Modal de registro */}
      <ModalComponent
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        // --- LÍNEA MODIFICADA ---
        // Conectamos la función handleRegister a la prop onRegister del modal.
        onRegister={handleRegister}
      />

      {/* Modal de login */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        users={users} // Pasamos los usuarios registrados
      />
    </div>
  );
}

export default App;
