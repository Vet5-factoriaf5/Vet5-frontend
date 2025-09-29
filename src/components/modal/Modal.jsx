import React, { useState, useRef } from "react";
import styles from "./Modal.module.css";
import "../../index.css";

// ModalComponent: Muestra un modal con dos pestañas (Usuario y Mascotas) para el registro de usuarios y sus mascotas.
// Estructura:
// - Tabs: Permite alternar entre el formulario de usuario y el de mascotas.
// - Formulario de Usuario: Captura datos personales y valida campos.
// - Formulario de Mascotas: Permite agregar varias mascotas, cada una con sus propios campos y selección de género.
// - Manejo de estados: formValues, formErrors, pets, activeTab y successMessage.
// - Navegación: Al completar usuario y pulsar "Continuar", se valida y pasa al tab de mascotas.
// - Registro: Al menos una mascota debe tener nombre y tipo para permitir el registro.

const ModalComponent = ({ isOpen, onClose, onRegister }) => {
    // Estado para los valores del formulario de usuario
    const [formValues, setFormValues] = useState({
        name: "",
        dni: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    // Estado para los errores de validación de usuario
    const [formErrors, setFormErrors] = useState({
        name: false,
        dni: false,
        email: false,
        phone: false,
        password: false,
        confirmPassword: false,
    });
    // Estado para las mascotas. Cada mascota tiene: nombre, especie, raza, edad, género
    const [pets, setPets] = useState([
        { name: "", species: "", breed: "", age: "", gender: "" },
    ]);
    // Estado para la pestaña activa: "register" (usuario) o "pet" (mascotas)
    const [activeTab, setActiveTab] = useState("register");
    // Estado para el mensaje de éxito o de error
    const [successMessage, setSuccessMessage] = useState("");

    // Referencias para inputs de usuario, permiten enfocar el siguiente campo al pulsar Enter
    const inputRefs = {
        name: useRef(null),
        dni: useRef(null),
        email: useRef(null),
        phone: useRef(null),
        password: useRef(null),
        confirmPassword: useRef(null),
    };

    // Si el modal no está abierto, no renderiza nada
    if (!isOpen) return null;

    // Validadores para los campos del formulario de usuario
    const validators = {
        name: (val) => val.trim().length > 0,
        dni: (val) => /^[XYZ0-9]{1}[0-9]{7}[A-Z]{1}$/.test(val),
        email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        phone: (val) => /^[\d\s+\-()]{6,}$/.test(val),
        password: (val) =>
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(val),
        confirmPassword: (val) =>
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(val) && val === formValues.password,
    };

    // Maneja cambios en los inputs del usuario, actualiza el estado y valida
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
        if (validators[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: !validators[name](value) }));
        }
        // Si cambia la contraseña, vuelve a validar la confirmación
        if (name === "password" && formValues.confirmPassword) {
            setFormErrors((prev) => ({
                ...prev,
                confirmPassword: !validators.confirmPassword(formValues.confirmPassword),
            }));
        }
    };

    // Permite navegar entre los inputs del usuario al pulsar Enter
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const order = [
                "name",
                "dni",
                "email",
                "phone",
                "password",
                "confirmPassword",
            ];
            const idx = order.indexOf(e.target.name);
            if (idx !== -1 && idx < order.length - 1) {
                const next = order[idx + 1];
                inputRefs[next]?.current?.focus();
            }
        }
    };

    // Maneja cambios en los campos de cada mascota (por índice)
    const handlePetChange = (index, field, value) => {
        setPets((prev) => {
            const newPets = [...prev];
            newPets[index] = { ...newPets[index], [field]: value };
            return newPets;
        });
    };

    // Añade una nueva mascota vacía al array de mascotas
    const addPet = () => {
        setPets((prev) => [...prev, { name: "", species: "", breed: "", age: "", gender: "" }]);
    };

    // Cambia de pestaña (tab). Si se va a "pet", valida primero el formulario de usuario
    const handleTabChange = (tab) => {
        if (tab === "pet") {
            const errors = {};
            Object.keys(formValues).forEach((key) => {
                errors[key] = !validators[key](formValues[key]);
            });
            setFormErrors(errors);
            const hasErrors = Object.values(errors).some((v) => v);
            if (!hasErrors) setActiveTab("pet");
        } else {
            setActiveTab("register");
        }
    };

    // Al pulsar "Continuar", cambia a la pestaña de mascotas si el usuario es válido
    const handleContinue = () => {
        handleTabChange("pet");
    };

    // Maneja el registro final: al menos una mascota debe tener nombre y tipo
    const handleRegister = (e) => {
        e.preventDefault();
        const hasValidPet = pets.some((pet) => pet.name.trim() && pet.species);
        if (hasValidPet) {
            setSuccessMessage("¡Usuario y mascotas registradas con éxito!");
            if (onRegister) {
                onRegister(formValues);
            }
            setTimeout(() => {
                setSuccessMessage("");
                setFormValues({
                    name: "",
                    dni: "",
                    email: "",
                    phone: "",
                    password: "",
                    confirmPassword: "",
                });
                setPets([{ name: "", species: "", breed: "", age: "", gender: "" }]);
                setActiveTab("register");
                onClose();
            }, 3000);
        } else {
            setSuccessMessage("Por favor, completa al menos el nombre y tipo de una mascota.");
            setTimeout(() => setSuccessMessage(""), 3000);
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles["modal__glass"]}>
                <div className={`${styles["modal__content"]} form-background`}>
                    {/* Botón para cerrar el modal */}
                    <button
                        className={styles["modal__close"]}
                        onClick={onClose}
                        type="button"
                        data-testid="btn-cerrar-modal"
                    >
                        ✕
                    </button>
                    <h2>Registro</h2>
                    <div className={styles.modal__separator}></div>
                    {/* Tabs para alternar entre Usuario y Mascotas */}
                    <div className={styles["modal__tabs"]}>
                        <button
                            type="button"
                            className={`${styles["modal__tab-link"]} ${activeTab === "register" ? styles["modal__tab-link--active"] : ""}`}
                            onClick={() => handleTabChange("register")}
                            data-testid="tab-usuario"
                        >
                            Usuario
                        </button>
                        <button
                            type="button"
                            className={`${styles["modal__tab-link"]} ${activeTab === "pet" ? styles["modal__tab-link--active"] : ""}`}
                            onClick={() => handleTabChange("pet")}
                            data-testid="tab-mascotas"
                        >
                            Mascotas
                        </button>
                    </div>
                    {/* Contenido de la pestaña activa */}
                    <div
                        className={styles["modal__tab-content"]}
                        style={{
                            maxHeight: activeTab === "pet" ? "70vh" : "none",
                            overflowY: activeTab === "pet" ? "auto" : "hidden",
                        }}
                    >
                        {/* Mensaje de éxito o error al registrar */}
                        {successMessage && activeTab === "pet" && (
                            <div className={styles["modal__success-message"]} data-testid="msg-exito">
                                {successMessage}
                            </div>
                        )}
                        {/* Formulario de registro de usuario */}
                        <form
                            style={{ display: activeTab === "register" ? "block" : "none" }}
                            autoComplete="on"
                        >
                            <div className={styles.modal__separator}></div>
                            {/* Campos del formulario de usuario */}
                            {[
                                { field: "name", label: "Nombre", autoComplete: "name" },
                                { field: "dni", label: "DNI | NIE", autoComplete: "off" },
                                { field: "email", label: "Email", autoComplete: "email" },
                                { field: "phone", label: "Teléfono", autoComplete: "tel" },
                                { field: "password", label: "Contraseña", autoComplete: "new-password" },
                                { field: "confirmPassword", label: "Confirmar Contraseña", autoComplete: "new-password" },
                            ].map(({ field, label, autoComplete }) => (
                                <div key={field} style={{ marginBottom: "16px" }}>
                                    <label htmlFor={field}>{label}</label>
                                    <input
                                        id={field}
                                        type={
                                            field === "password" || field === "confirmPassword"
                                                ? "password"
                                                : field === "phone"
                                                ? "tel"
                                                : "text"
                                        }
                                        name={field}
                                        value={formValues[field]}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        ref={inputRefs[field]}
                                        className={formErrors[field] ? "input-error" : ""}
                                        data-testid={`input-${field}`}
                                        autoComplete={autoComplete}
                                    />
                                    {/* Muestra errores de validación por campo */}
                                    {formErrors[field] && (
                                        <span className="input-error-message" style={{ fontSize: "10px" }}>
                                            {field === "dni"
                                                ? "Formato DNI/NIE inválido"
                                                : field === "email"
                                                ? "Formato de correo inválido"
                                                : field === "phone"
                                                ? "Formato de teléfono inválido"
                                                : field === "password"
                                                ? "Contraseña inválida"
                                                : field === "name"
                                                ? "Nombre requerido"
                                                : "La contraseña no cumple las reglas o no coincide"}
                                        </span>
                                    )}
                                    {/* Ayuda para contraseña */}
                                    {field === "password" && (
                                        <span style={{ fontSize: "10px", color: "#555" }}>
                                            8 caracteres, mayúsculas, números y un carácter especial.
                                        </span>
                                    )}
                                    {field === "confirmPassword" && (
                                        <span style={{ fontSize: "10px", color: "#555" }}>
                                            Debe coincidir con la contraseña y cumplir las mismas reglas.
                                        </span>
                                    )}
                                </div>
                            ))}
                            <div className={styles.modal__separator}></div>
                            {/* Botón para continuar al registro de mascotas */}
                            <button
                                type="button"
                                className="btn-filled"
                                onClick={handleContinue}
                                data-testid="btn-continuar"
                            >
                                Continuar
                            </button>
                        </form>
                        {/* Formulario para registrar mascotas */}
                        <form
                            style={{ display: activeTab === "pet" ? "block" : "none" }}
                            autoComplete="off"
                        >
                            <div className={styles.modal__separator}></div>
                            {/* Mapeo de cada mascota y sus campos */}
                            {pets.map((pet, index) => (
                                <div key={index} className={styles["pet-block"]}>
                                    {/* Nombre de la mascota */}
                                    <div style={{ marginBottom: "16px" }}>
                                        <label htmlFor={`pet-name-${index}`}>Nombre</label>
                                        <input
                                            id={`pet-name-${index}`}
                                            type="text"
                                            value={pet.name}
                                            onChange={(e) => handlePetChange(index, "name", e.target.value)}
                                            data-testid={`input-pet-name-${index}`}
                                            autoComplete="off"
                                        />
                                    </div>
                                    {/* Tipo de mascota */}
                                    <div style={{ marginBottom: "16px" }}>
                                        <label htmlFor={`pet-species-${index}`}>Tipo de Mascota</label>
                                        <select
                                            id={`pet-species-${index}`}
                                            value={pet.species}
                                            onChange={(e) => handlePetChange(index, "species", e.target.value)}
                                            data-testid={`input-pet-species-${index}`}
                                            autoComplete="off"
                                        >
                                            <option value="">Seleccione</option>
                                            <option>Perro</option>
                                            <option>Gato</option>
                                            <option>Ave</option>
                                            <option>Conejo / Roedor</option>
                                            <option>Pez</option>
                                            <option>Reptil</option>
                                            <option>Exótico</option>
                                            <option>Otro</option>
                                        </select>
                                    </div>
                                    {/* Raza o especie */}
                                    <div style={{ marginBottom: "16px" }}>
                                        <label htmlFor={`pet-breed-${index}`}>Raza o Especie</label>
                                        <input
                                            id={`pet-breed-${index}`}
                                            type="text"
                                            value={pet.breed}
                                            onChange={(e) => handlePetChange(index, "breed", e.target.value)}
                                            data-testid={`input-pet-breed-${index}`}
                                            autoComplete="off"
                                        />
                                    </div>
                                    {/* Edad */}
                                    <div style={{ marginBottom: "16px" }}>
                                        <label htmlFor={`pet-age-${index}`}>Edad</label>
                                        <input
                                            id={`pet-age-${index}`}
                                            type="number"
                                            value={pet.age}
                                            onChange={(e) => handlePetChange(index, "age", e.target.value)}
                                            data-testid={`input-pet-age-${index}`}
                                            autoComplete="off"
                                        />
                                    </div>
                                    {/* Selección de género (radio) */}
                                    <div className={styles["modal__radio-group"]} style={{ marginBottom: "16px" }}>
                                        <div>
                                            <input
                                                type="radio"
                                                id={`gender-macho-${index}`}
                                                name={`gender-${index}`}
                                                checked={pet.gender === "Macho"}
                                                onChange={() => handlePetChange(index, "gender", "Macho")}
                                                data-testid={`input-pet-gender-macho-${index}`}
                                                autoComplete="off"
                                            />
                                            <label htmlFor={`gender-macho-${index}`}>Macho</label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                id={`gender-hembra-${index}`}
                                                name={`gender-${index}`}
                                                checked={pet.gender === "Hembra"}
                                                onChange={() => handlePetChange(index, "gender", "Hembra")}
                                                data-testid={`input-pet-gender-hembra-${index}`}
                                                autoComplete="off"
                                            />
                                            <label htmlFor={`gender-hembra-${index}`}>Hembra</label>
                                        </div>
                                    </div>
                                    <div className={styles.modal__separator}></div> 
                                </div>
                            ))}
                            {/* Botones para añadir mascota y finalizar registro */}
                            <div className={styles["modal__buttons"]}>
                                <button
                                    type="button"
                                    className="btn-outline"
                                    onClick={addPet}
                                    data-testid="btn-add-mascota"
                                >
                                    + Mascota
                                </button>
                                <button
                                    type="button"
                                    className="btn-filled"
                                    onClick={handleRegister}
                                    data-testid="btn-registrarse"
                                >
                                    Registrarse
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalComponent;