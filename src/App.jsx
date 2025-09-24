/*import FormDemo from "./components/FormDemo";
import './App.css'*/
import React, { useState } from "react";
import Modal from "./components/modal/Modal.jsx";
import Home from "./pages/Home";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <Home />
      <button className="btn-filled" onClick={() => setIsModalOpen(true)}>
        Abrir Modal
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default App;
