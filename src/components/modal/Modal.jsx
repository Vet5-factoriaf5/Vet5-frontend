import React, { useState, useRef } from "react";
import styles from "./Modal.module.css";

const Modal = ({ isOpen, onClose }) => {
    // State
    const [activeTab, setActiveTab] = useState("register"); // por defecto registro
    const [pets, setPets] = useState([{ name: "", species: "", breed: "", age: "", gender: "" }]);
    const [formValues, setFormValues] = useState({
        name: "",
        dni: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [formErrors, setFormErrors] = useState({
        dni: false,
        email: false,
        phone: false,
        password: false,
        confirmPassword: false,
    });

    // Refs
    const inputRefs = {
        name: useRef(),
        dni: useRef(),
        email: useRef(),
        phone: useRef(),
        password: useRef(),
        confirmPassword: useRef(),
    };

    if (!isOpen) return null; // No renderiza si está cerrado

    // Validation functions
    const validateDni = (dni) => {
        const dniRegex = /^[XYZ0-9]{1}[0-9]{7}[A-Z]{1}$/;
        return dniRegex.test(dni);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^[\d\s+\-()]{6,}$/;
        return phoneRegex.test(phone);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
        return passwordRegex.test(password);
    };

    const validateConfirmPassword = (confirmPassword) => {
        return confirmPassword === formValues.password;
    };

    // Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));

        let isValid = true;
        if (name === "dni") isValid = validateDni(value);
        else if (name === "email") isValid = validateEmail(value);
        else if (name === "phone") isValid = validatePhone(value);
        else if (name === "password") isValid = validatePassword(value);
        else if (name === "confirmPassword") isValid = validateConfirmPassword(value);

        if (isValid) {
            setFormErrors((prev) => ({ ...prev, [name]: false }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let isError = false;

        if (name === "dni") isError = !validateDni(value);
        else if (name === "email") isError = !validateEmail(value);
        else if (name === "phone") isError = !validatePhone(value);
        else if (name === "password") isError = !validatePassword(value);
        else if (name === "confirmPassword") isError = !validateConfirmPassword(value);

        setFormErrors((prev) => ({ ...prev, [name]: isError }));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const order = ["name", "dni", "email", "phone", "password", "confirmPassword"];
            const currentIndex = order.indexOf(e.target.name);
            if (currentIndex !== -1 && currentIndex < order.length - 1) {
                const nextInputName = order[currentIndex + 1];
                if (inputRefs[nextInputName] && inputRefs[nextInputName].current) {
                    inputRefs[nextInputName].current.focus();
                }
            }
        }
    };

    const addPet = () => {
        const lastPet = pets[pets.length - 1];
        const hasValues = Object.values(lastPet).some((value) => value !== "");
        if (hasValues) {
            alert("Por favor, guarda o completa la mascota actual antes de añadir una nueva.");
            return;
        }
        setPets([...pets, { name: "", species: "", breed: "", age: "", gender: "" }]);
    };

    const handleContinue = () => {
        const dniError = !validateDni(formValues.dni);
        const emailError = !validateEmail(formValues.email);
        const phoneError = !validatePhone(formValues.phone);
        const passwordError = !validatePassword(formValues.password);
        const confirmPasswordError = formValues.confirmPassword !== formValues.password;

        setFormErrors({
            dni: dniError,
            email: emailError,
            phone: phoneError,
            password: passwordError,
            confirmPassword: confirmPasswordError,
        });

        if (!dniError && !emailError && !phoneError && !passwordError && !confirmPasswordError) {
            setActiveTab("pet");
        }
    };

    return (
        <div className={styles.modal}>
            <div className={`${styles["modal__content"]} form-background`}>
                <button className={styles["modal__close"]} onClick={onClose}>
                    ✕
                </button>
                <h2>Registro</h2>
                <div className={styles.modal__separator}></div>

                <div className={styles["modal__tabs"]}>
                    <button
                        className={`${styles["modal__tab-link"]} ${
                            activeTab === "register" ? styles["modal__tab-link--active"] : ""
                        }`}
                        onClick={() => setActiveTab("register")}
                    >
                        Usuario
                    </button>
                    <button
                        className={`${styles["modal__tab-link"]} ${
                            activeTab === "pet" ? styles["modal__tab-link--active"] : ""
                        }`}
                        onClick={() => {
                            if (
                                !formErrors.dni &&
                                !formErrors.email &&
                                !formErrors.phone &&
                                !formErrors.password &&
                                !formErrors.confirmPassword
                            ) {
                                setActiveTab("pet");
                            }
                        }}
                    >
                        Mascotas
                    </button>
                </div>

                <div className={styles["modal__tab-content"]}>
                    {activeTab === "register" && (
                        <form>
                            <div className={styles.modal__separator}></div>
                            <label>Nombre</label>
                            <input
                                type="text"
                                name="name"
                                value={formValues.name}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                ref={inputRefs.name}
                            />

                            <label htmlFor="dni">DNI | NIE</label>
                            <input
                                type="text"
                                id="dni"
                                name="dni"
                                pattern="[XYZ0-9]{1,1}[0-9]{7}[A-Z]{1}"
                                required
                                value={formValues.dni}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={formErrors.dni ? "input-error" : ""}
                                onKeyDown={handleKeyDown}
                                ref={inputRefs.dni}
                            />
                            {formErrors.dni && (
                                <span className="input-error-message" style={{ fontSize: "10px" }}>
                                    Formato DNI/NIE inválido. Debe seguir el patrón correcto.
                                </span>
                            )}

                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formValues.email}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={formErrors.email ? "input-error" : ""}
                                onKeyDown={handleKeyDown}
                                ref={inputRefs.email}
                            />
                            {formErrors.email && (
                                <span className="input-error-message" style={{ fontSize: "10px" }}>
                                    Formato de email inválido.
                                </span>
                            )}

                            <label>Teléfono</label>
                            <input
                                type="phone"
                                name="phone"
                                value={formValues.phone}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={formErrors.phone ? "input-error" : ""}
                                onKeyDown={handleKeyDown}
                                ref={inputRefs.phone}
                            />
                            {formErrors.phone && (
                                <span className="input-error-message" style={{ fontSize: "10px" }}>
                                    Formato de teléfono inválido.
                                </span>
                            )}

                            <label>Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="********"
                                value={formValues.password}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={formErrors.password ? "input-error" : ""}
                                onKeyDown={handleKeyDown}
                                ref={inputRefs.password}
                            />
                            <span style={{ fontSize: "10px", color: "#555" }}>
                                8 caracteres, debe tener mayúsculas, números y un carácter especial.
                            </span>

                            <label>Confirmar Contraseña</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="********"
                                value={formValues.confirmPassword}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={formErrors.confirmPassword ? "input-error" : ""}
                                onKeyDown={handleKeyDown}
                                ref={inputRefs.confirmPassword}
                            />
                            {formErrors.confirmPassword && (
                                <span className="input-error-message" style={{ fontSize: "10px" }}>
                                    Las contraseñas no coinciden.
                                </span>
                            )}

                            <div className={styles.modal__separator}></div>

                            <button type="button" className="btn-filled" onClick={handleContinue}>
                                Continuar
                            </button>
                        </form>
                    )}

                    {activeTab === "pet" && (
                        <form>
                            <div className={styles.modal__separator}></div>
                            {pets.map((pet, index) => (
                                <div key={index}>
                                    <label>Nombre</label>
                                    <input type="text" />

                                    <label htmlFor={`pet-${index}`}>Mascota</label>
                                    <select id={`pet-${index}`}>
                                        <option>Perro</option>
                                        <option>Gato</option>
                                        <option>Ave</option>
                                        <option>Conejo / Roedor</option>
                                        <option>Pez</option>
                                        <option>Reptil</option>
                                        <option>Exótico</option>
                                        <option>Otro</option>
                                    </select>

                                    <label>Raza o Especie</label>
                                    <input type="text" />

                                    <label>Edad</label>
                                    <input type="number" />

                                    <div className={styles["modal__radio-group"]}>
                                        <label>
                                            <input type="radio" name={`gender-${index}`} /> Macho
                                        </label>
                                        <label>
                                            <input type="radio" name={`gender-${index}`} /> Hembra
                                        </label>
                                    </div>
                                </div>
                            ))}

                            <div className={styles.modal__separator}></div>
                            <div className={styles["modal__buttons"]}>
                                <button type="button" className="btn-outline" onClick={addPet}>
                                    + Mascota
                                </button>
                                <button type="submit" className="btn-filled">
                                    Registrarse
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;