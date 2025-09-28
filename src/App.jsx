import React from "react";
import Home from "./pages/Home";
import Footer from './components/Footer';
import Nav from "./components/Nav";
import './components/footer.css';

function App() {
  return (
    <div>
      <Nav />
      <Home />
      <Footer />
    </div>
  );
}

export default App;
