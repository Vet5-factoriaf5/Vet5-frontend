import React, { useState, useRef } from "react";
import styles from "./Modal.module.css";
import "../../index.css"; // Globales de dev, aplican a todo el modal y la app

// Componente Modal principal renombrado a ModalComponent para evitar conflictos
// Props:
// - isOpen: boolean, controla si el modal está visible
// - onClose: función para cerrar el modal
const ModalComponent = ({ isOpen, onClose }) => {
    // -------------------------
    // Estados del componente
    // -------------------------
    const [activeTab, setActiveTab] = useState("register"); // Tab por defecto: registro de usuario
    const [pets, setPets] = useState([
        { name: "", species: "", breed: "", age: "", gender: "" },
    ]); // Lista de mascotas, inicia con una ficha vacía
    const [formValues, setFormValues] = useState({
        name: "",
        dni: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    }); // Datos del usuario
    const [formErrors, setFormErrors] = useState({
        dni: false,
        email: false,
        phone: false,
        password: false,
        confirmPassword: false,
    }); // Errores de validación por campo

    // -------------------------
    // Refs para navegar entre inputs con Enter
    // -------------------------
    const inputRefs = {
        name: useRef(null),
        dni: useRef(null),
        email: useRef(null),
        phone: useRef(null),
        password: useRef(null),
        confirmPassword: useRef(null),
    };

    // No renderiza el modal si isOpen es false
    if (!isOpen) return null;

    // -------------------------
    // Validaciones de campos
    // -------------------------
    const validators = {
        dni: (val) => /^[XYZ0-9]{1}[0-9]{7}[A-Z]{1}$/.test(val),
        email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        phone: (val) => /^[\d\s+\-()]{6,}$/.test(val),
        password: (val) =>
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
                val
            ),
        confirmPassword: (val) => val === formValues.password,
    };

    // -------------------------
    // Manejo de cambios en inputs de usuario
    // -------------------------
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Actualiza el estado del formulario
        setFormValues((prev) => ({ ...prev, [name]: value }));

        // Valida el campo y actualiza errores
        if (validators[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: !validators[name](value) }));
        }
    };

    // Navegación con Enter entre inputs
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

    // -------------------------
    // Manejo de cambios en inputs de mascotas
    // -------------------------
    const handlePetChange = (index, field, value) => {
        const newPets = [...pets];
        newPets[index][field] = value;
        setPets(newPets);
    };

    // Agregar nueva mascota
    const addPet = () => {
        setPets([...pets, { name: "", species: "", breed: "", age: "", gender: "" }]);
    };

    // -------------------------
    // Continuar al tab de mascotas tras validar usuario
    // -------------------------
    const handleContinue = () => {
        const errors = {};
        Object.keys(validators).forEach((key) => {
            errors[key] = !validators[key](formValues[key]);
        });
        setFormErrors(errors);

        const hasErrors = Object.values(errors).some((v) => v);
        if (!hasErrors) setActiveTab("pet");
    };

    return (
        <div className={styles.modal}>
            <div className={`${styles["modal__content"]} form-background`}>
                {/* Botón para cerrar modal */}
                <button className={styles["modal__close"]} onClick={onClose} type="button">
                    ✕
                </button>

                {/* Título y separador */}
                <h2>Registro</h2>
                <div className={styles.modal__separator}></div>

                {/* Tabs para cambiar entre usuario y mascotas */}
                <div className={styles["modal__tabs"]}>
                    <button
                        type="button"
                        className={`${styles["modal__tab-link"]} ${activeTab === "register" ? styles["modal__tab-link--active"] : ""
                            }`}
                        onClick={() => setActiveTab("register")}
                    >
                        Usuario
                    </button>
                    <button
                        type="button"
                        className={`${styles["modal__tab-link"]} ${activeTab === "pet" ? styles["modal__tab-link--active"] : ""
                            }`}
                        onClick={() => {
                            if (!Object.values(formErrors).some((v) => v)) {
                                setActiveTab("pet");
                            }
                        }}
                    >
                        Mascotas
                    </button>
                </div>

                {/* Contenido de tabs */}
                <div
                    className={styles["modal__tab-content"]}
                    style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }} // Scroll si hay muchas mascotas
                >
                    {/* Tab Registro Usuario */}
                    {activeTab === "register" && (
                        <form>
                            <div className={styles.modal__separator}></div>

                            {/* Genera inputs dinámicamente con validaciones */}
                            {[
                                "name",
                                "dni",
                                "email",
                                "phone",
                                "password",
                                "confirmPassword",
                            ].map((field) => (
                                <div key={field} style={{ marginBottom: "24px" }}>
                                    <label htmlFor={field}>
                                        {field === "confirmPassword"
                                            ? "Confirmar Contraseña"
                                            : field.charAt(0).toUpperCase() + field.slice(1)}
                                    </label>
                                    <input
                                        id={field}
                                        type={field.includes("password") ? "password" : "text"}
                                        name={field}
                                        value={formValues[field]}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        ref={inputRefs[field]}
                                        className={formErrors[field] ? "input-error" : ""}
                                    />
                                    {formErrors[field] && (
                                        <span className="input-error-message" style={{ fontSize: "10px" }}>
                                            {field === "dni"
                                                ? "Formato DNI/NIE inválido"
                                                : field === "email"
                                                    ? "Formato de email inválido"
                                                    : field === "phone"
                                                        ? "Formato de teléfono inválido"
                                                        : field === "password"
                                                            ? "Contraseña inválida"
                                                            : "Las contraseñas no coinciden"}
                                        </span>
                                    )}
                                    {field === "password" && (
                                        <span style={{ fontSize: "10px", color: "#555" }}>
                                            8 caracteres, mayúsculas, números y un carácter especial.
                                        </span>
                                    )}
                                </div>
                            ))}

                            <div className={styles.modal__separator}></div>

                            {/* Botón para continuar al tab de mascotas */}
                            <button type="button" className="btn-filled" onClick={handleContinue}>
                                Continuar
                            </button>
                        </form>
                    )}

                    {/* Tab Mascotas */}
                    {activeTab === "pet" && (
                        <form>
                            <div className={styles.modal__separator}></div>

                            {/* Lista de mascotas */}
                            {pets.map((pet, index) => (
                                <div key={index} style={{ marginBottom: "24px" }}>
                                    <label htmlFor={`pet-name-${index}`}>Nombre</label>
                                    <input
                                        id={`pet-name-${index}`}
                                        type="text"
                                        value={pet.name}
                                        onChange={(e) => handlePetChange(index, "name", e.target.value)}
                                    />

                                    <label htmlFor={`pet-species-${index}`}>Tipo de Mascota</label>
                                    <select
                                        id={`pet-species-${index}`}
                                        value={pet.species}
                                        onChange={(e) => handlePetChange(index, "species", e.target.value)}
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

                                    <label htmlFor={`pet-breed-${index}`}>Raza o Especie</label>
                                    <input
                                        id={`pet-breed-${index}`}
                                        type="text"
                                        value={pet.breed}
                                        onChange={(e) => handlePetChange(index, "breed", e.target.value)}
                                    />

                                    <label htmlFor={`pet-age-${index}`}>Edad</label>
                                    <input
                                        id={`pet-age-${index}`}
                                        type="number"
                                        value={pet.age}
                                        onChange={(e) => handlePetChange(index, "age", e.target.value)}
                                    />

                                    {/* Selección de género horizontal */}
                                    <div className={styles["modal__radio-group"]}>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`gender-${index}`}
                                                checked={pet.gender === "Macho"}
                                                onChange={() => handlePetChange(index, "gender", "Macho")}
                                            />{" "}
                                            Macho
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`gender-${index}`}
                                                checked={pet.gender === "Hembra"}
                                                onChange={() => handlePetChange(index, "gender", "Hembra")}
                                            />{" "}
                                            Hembra
                                        </label>
                                    </div>
                                    <div className={styles.modal__separator}></div>
                                </div>
                            ))}

                            {/* Botones al final del tab de mascotas */}
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

export default ModalComponent;