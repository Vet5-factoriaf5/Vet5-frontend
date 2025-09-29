// src/components/LoginModal.jsx
import React, { useState } from 'react';
import './LoginModal.css';

export default function LoginModal({ isOpen, onClose, registeredUsers }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = registeredUsers.find(
            (user) => user.email === email && user.password === password
        );
        if (user) {
            setError('');
            setEmail('');
            setPassword('');
            onClose();
        } else {
            setError('Correo electrónico o contraseña incorrectos');
        }
    };

    return (
        <div className="login-modal-overlay" onClick={onClose}>
            <div className="login-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Iniciar sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit">Entrar</button>
                </form>
                <button className="close-btn" onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
}