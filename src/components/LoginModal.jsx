// src/components/LoginModal.jsx
import React from 'react';
import './LoginModal.css';

export default function LoginModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="login-modal-overlay" onClick={onClose}>
            <div className="login-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Iniciar sesión</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico</label>
                        <input type="email" id="email"  />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" />
                    </div>
                    <button type="submit">Entrar</button>
                </form>
                <button className="close-btn" onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
}