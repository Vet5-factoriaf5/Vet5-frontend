import React, { useState } from "react";
import "./index.css"; // globales de dev

import ModalComponent from "./components/modal/Modal.jsx";

function App() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="App">
      <button onClick={() => setModalOpen(true)}>Abrir Modal</button>

      <ModalComponent isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default App;
