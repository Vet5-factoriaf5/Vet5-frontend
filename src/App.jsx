import React, { useState } from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from "./pages/Home";
import LoginModal from './components/LoginModal';
import './App.css';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="App">
      <Home />
      <Nav onLoginClick={() => setIsLoginOpen(true)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <Footer />
    </div>
  );
}

export default App;
