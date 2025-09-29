import React, { useState } from 'react';
import Nav from './components/nav/nav';
import Footer from './components/footer/Footer';
import Home from "./pages/home/Home";
import LoginModal from './components/loginmodal/LoginModal';
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
