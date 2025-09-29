import React, { useState } from 'react';
import './LoginModal.css';

export default function LoginModal({ isOpen, onClose, registeredUsers }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email || !password) {
            setMessage('Por favor completa todos los campos');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        const user = registeredUsers.find(
            (user) => user.email === email && user.password === password
        );

        if (user) {
            setMessage('¡Usuario registrado correctamente!');
            setEmail('');
            setPassword('');
            setTimeout(() => {
                setMessage('');
                onClose();
            }, 1500);
        } else {
            setMessage('Correo electrónico o contraseña incorrectos');
            setTimeout(() => setMessage(''), 3000);
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
                            autoComplete="email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>
                    {message && (
                        <p
                            className={
                                message.includes('incorrectos') || message.includes('completa')
                                    ? 'error-message'
                                    : 'success-message'
                            }
                        >
                            {message}
                        </p>
                    )}
                    <button type="submit">Entrar</button>
                    <button type="button" className="outline-btn" onClick={onClose}>Cerrar</button>
                </form>
            </div>
        </div>
    );
}