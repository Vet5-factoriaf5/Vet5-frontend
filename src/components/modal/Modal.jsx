// Modal.jsx - VERSIÓN ACTUALIZADA
import React, { useState, useRef } from "react";
import styles from "./Modal.module.css";
import "../../index.css";

const ModalComponent = ({ isOpen, onClose, onRegister }) => {
    // --- ESTADOS DEL COMPONENTE ---
    const [formValues, setFormValues] = useState({
        name: "",
        dni: "",           // ✅ Este será el username en el backend
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Estados independientes para la visibilidad de cada campo de contraseña
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Referencias para el manejo del foco con la tecla Enter
    const inputRefs = {
        name: useRef(null),
        dni: useRef(null),
        email: useRef(null),
        phone: useRef(null),
        password: useRef(null),
        confirmPassword: useRef(null),
    };

    // Si el modal no está abierto, no renderiza nada
    if (!isOpen) {
        return null;
    }

    // --- LÓGICA DE VALIDACIÓN ---
    const validators = {
        name: (val) => val.trim().length > 0,
        dni: (val) => /^[XYZ0-9]{1}[0-9]{7}[A-Z]{1}$/.test(val), // Validación DNI español
        email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        phone: (val) => /^[\d\s+\-()]{6,}$/.test(val),
        password: (val) => /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(val),
        confirmPassword: (val) => val === formValues.password,
    };

    // --- MANEJADORES DE EVENTOS ---

    // Actualiza el estado del formulario al escribir en los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
        // Limpia el error del campo actual mientras el usuario escribe
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: false }));
        }
    };

    // Permite navegar entre campos con la tecla Enter
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const order = ["name", "dni", "email", "phone", "password", "confirmPassword"];
            const idx = order.indexOf(e.target.name);
            if (idx !== -1 && idx < order.length - 1) {
                inputRefs[order[idx + 1]]?.current?.focus();
            }
        }
    };

    // Lógica principal al hacer clic en "Registrarse"
    const handleRegister = (e) => {
        e.preventDefault();
        const errors = {};
        let hasErrors = false;

        // Valida todos los campos
        Object.keys(validators).forEach((key) => {
            if (!validators[key](formValues[key])) {
                errors[key] = true;
                hasErrors = true;
            }
        });
        setFormErrors(errors);

        if (hasErrors) {
            setErrorMessage("Por favor, corrige los campos marcados.");
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        // Si no hay errores, procede con el registro
        setErrorMessage("");
        setSuccessMessage("¡Usuario registrado con éxito!");

        // ✅ Enviar los datos al backend - el DNI será el username
        onRegister({
            ...formValues
            // El DNI ya está en formValues.dni y se enviará como username al backend
        });

        // Espera 2 segundos para que el usuario vea el mensaje y luego cierra
        setTimeout(() => {
            setSuccessMessage("");
            setFormValues({ name: "", dni: "", email: "", phone: "", password: "", confirmPassword: "" });
            onClose();
        }, 2000);
    };

    // --- RENDERIZADO DEL COMPONENTE ---
    return (
        <div className={styles.modal}>
            <div className={`${styles["modal__content"]} ${styles["modal__glass"]}`}>
                {/* El mensaje de éxito se renderiza aquí para que pueda flotar por encima de todo */}
                {successMessage && <div className={styles["modal__success-message"]}>{successMessage}</div>}

                <button className={styles["modal__close"]} onClick={onClose} type="button" aria-label="Cerrar">✕</button>
                <h2>Registro</h2>
                <div className={styles.modal__separator}></div>

                {errorMessage && <div className={styles["modal__error-message"]}>{errorMessage}</div>}

                <div className={styles["modal__tab-content"]}>
                    <form autoComplete="off">
                        {[
                            { field: "name", label: "Nombre", type: "text", placeholder: "Tu nombre completo" },
                            {
                                field: "dni",
                                label: "DNI",
                                type: "text",
                                placeholder: "Ej: 12345678A",
                                important: true  // ✅ Marcar como campo importante
                            },
                            { field: "email", label: "Email", type: "email", placeholder: "tu@email.com" },
                            { field: "phone", label: "Teléfono", type: "tel", placeholder: "612345678" },
                            { field: "password", label: "Contraseña", type: "password", placeholder: "Mín. 8 caracteres" },
                            { field: "confirmPassword", label: "Confirmar Contraseña", type: "password", placeholder: "Repite tu contraseña" },
                        ].map(({ field, label, placeholder, type, important }) => (
                            <div key={field} className={styles.formField}>
                                <label htmlFor={field}>
                                    {label}
                                    {important && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
                                </label>
                                {type === "password" ? (
                                    <div className={styles.passwordWrapper}>
                                        <input
                                            id={field}
                                            type={(field === 'password' && showPassword) || (field === 'confirmPassword' && showConfirmPassword) ? 'text' : 'password'}
                                            name={field}
                                            value={formValues[field]}
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            ref={inputRefs[field]}
                                            className={formErrors[field] ? "input-error" : ""}
                                            placeholder={placeholder}
                                        />
                                        <span
                                            onClick={() => field === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
                                            className={styles.eyeIcon}
                                        >
                                            {(field === 'password' && showPassword) || (field === 'confirmPassword' && showConfirmPassword) ? "🙈" : "👁️"}
                                        </span>
                                    </div>
                                ) : (
                                    <input
                                        id={field}
                                        type={type}
                                        name={field}
                                        value={formValues[field]}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        ref={inputRefs[field]}
                                        className={formErrors[field] ? "input-error" : ""}
                                        placeholder={placeholder}
                                    />
                                )}
                                {formErrors[field] && (
                                    <span className="input-error-message" style={{ fontSize: "10px" }}>
                                        {field === 'dni' ? 'Formato de DNI inválido' : 'Dato inválido o requerido'}
                                    </span>
                                )}
                            </div>
                        ))}
                    </form>
                </div>

                <div className={styles.modal__footer}>
                    <button type="button" className="btn-filled" onClick={handleRegister}>
                        Registrarse
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalComponent;
