import React, { useState } from "react";
import "./LoginModal.css";
import "../../index.css";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
    const [formValues, setFormValues] = useState({ identifier: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { identifier, password } = formValues;

        try {
            await onLogin(identifier, password);
            setSuccessMessage("¡Inicio de sesión exitoso!");
            setErrorMessage("");

            setTimeout(() => {
                setFormValues({ identifier: "", password: "" });
                setSuccessMessage("");
                onClose();
            }, 2000);
        } catch (err) {
            setErrorMessage("Usuario o contraseña incorrectos");
            setSuccessMessage("");
        }
    };

    return (
        <div className="modal">
            <div className="modal__content modal__glass">
                <button className="modal__close" onClick={onClose} type="button">✕</button>
                <h2>Iniciar Sesión</h2>
                <div className="modal__separator"></div>

                {successMessage && (
                    <div className="modal__success-message" data-testid="success-message">
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="modal__error-message" data-testid="error-message">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} autoComplete="off">
                    <div style={{ marginBottom: "16px" }}>
                        <label htmlFor="identifier">Usuario (DNI)</label>
                        <input
                            id="identifier"
                            name="identifier"
                            type="text"
                            value={formValues.identifier}
                            onChange={handleInputChange}
                            autoComplete="off"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formValues.password}
                            onChange={handleInputChange}
                            autoComplete="off"
                            required
                        />
                    </div>

                    <div className="modal__separator_down"></div>
                    <button type="submit" className="btn-filled" data-testid="login-button">
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;