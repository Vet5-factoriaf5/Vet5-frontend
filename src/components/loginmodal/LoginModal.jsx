import React, { useState } from "react";
import "./LoginModal.css";
import "../../index.css";

const LoginModal = ({ isOpen, onClose, users, closeDelay = 3000 }) => {
    const [formValues, setFormValues] = useState({
        identifier: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Usuarios disponibles:", users);
        console.log("Datos de login:", formValues);
        const user = users.find(
            (u) =>
                (u.email === formValues.identifier || u.dni === formValues.identifier) &&
                u.password === formValues.password
        );
        if (user) {
            setSuccessMessage("¡Inicio de sesión exitoso!");
            setErrorMessage("");
            setTimeout(() => {
                setFormValues({ identifier: "", password: "" });
                setSuccessMessage("");
                onClose();
            }, closeDelay);
        } else {
            setErrorMessage("Usuario o contraseña incorrectos");
            setSuccessMessage("");
        }
    };

    return (
        <div className="modal">
            <div className="modal__content modal__glass">
                <button
                    className="modal__close"
                    onClick={onClose}
                    type="button"
                >
                    ✕
                </button>
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
                <form onSubmit={handleLogin} autoComplete="off">
                    <div style={{ marginBottom: "16px" }}>
                        <label htmlFor="identifier">DNI</label>
                        <input
                            id="identifier"
                            type="text"
                            name="identifier"
                            value={formValues.identifier}
                            onChange={handleInputChange}
                            autoComplete="off"
                        />
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formValues.password}
                            onChange={handleInputChange}
                            autoComplete="off"
                        />
                    </div>
                    <div className="modal__separator"></div>
                    <button type="submit" className="btn-filled" data-testid="login-button">
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;