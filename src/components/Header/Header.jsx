import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <header className="header-container">
            {/* TODO: SVP Follow Figma Prototype */}
            <h1 className="header-title">Happy Paws Veterinary Clinic</h1>
            <nav>
                <ul>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Services</a></li>
                    <li><a href="#">Our Team</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;