import React, { useState, useRef } from "react";
import styles from "./Modal.module.css";
import "../../index.css";

const ModalComponent = ({ isOpen, onClose, onRegister }) => {
    const [formValues, setFormValues] = useState({
        name: "",
        dni: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [formErrors, setFormErrors] = useState({
        name: false,
        dni: false,
        email: false,
        phone: false,
        password: false,
        confirmPassword: false,
    });
    const [pets, setPets] = useState([
        { name: "", species: "", breed: "", age: "", gender: "" },
    ]);
    const [activeTab, setActiveTab] = useState("register");
    const [successMessage, setSuccessMessage] = useState("");

    const inputRefs = {
        name: useRef(null),
        dni: useRef(null),
        email: useRef(null),
        phone: useRef(null),
        password: useRef(null),
        confirmPassword: useRef(null),
    };

    if (!isOpen) return null;

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
        if (validators[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: !validators[name](value) }));
        }
        if (name === "password" && formValues.confirmPassword) {
            setFormErrors((prev) => ({
                ...prev,
                confirmPassword: !validators.confirmPassword(formValues.confirmPassword),
            }));
        }
    };

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

    const handlePetChange = (index, field, value) => {
        setPets((prev) => {
            const newPets = [...prev];
            newPets[index] = { ...newPets[index], [field]: value };
            return newPets;
        });
    };

    const addPet = () => {
        setPets((prev) => [...prev, { name: "", species: "", breed: "", age: "", gender: "" }]);
    };

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

    const handleContinue = () => {
        handleTabChange("pet");
    };

    const handleRegister = (e) => {
        e.preventDefault();
        const hasValidPet = pets.some((pet) => pet.name.trim() && pet.species);
        if (hasValidPet) {
            setSuccessMessage("¡Usuario y mascotas registradas con éxito!");
            onRegister({
                name: formValues.name,
                dni: formValues.dni,
                email: formValues.email,
                phone: formValues.phone,
                password: formValues.password,
                pets
            });
            setTimeout(() => {
                console.log("Ejecutando cierre del modal");
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
                console.log("Llamando a onClose");
                onClose();
            }, 3000);
        } else {
            setSuccessMessage("Por favor, completa al menos el nombre y tipo de una mascota");
            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        }
    };

    return (
        <div
            className={styles.modal}
            style={{ backgroundPosition: "center" }}
        >
            <div className={`${styles["modal__content"]} ${styles["modal__glass"]}`}>
                <button
                    className={styles["modal__close"]}
                    onClick={() => {
                        console.log("Cerrar modal manualmente");
                        onClose();
                    }}
                    type="button"
                >
                    ✕
                </button>
                <h2>Registro</h2>
                <div className={styles.modal__separator}></div>
                <div className={styles["modal__tabs"]}>
                    <button
                        type="button"
                        className={`${styles["modal__tab-link"]} ${activeTab === "register"
                            ? styles["modal__tab-link--active"]
                            : ""
                        }`}
                        onClick={() => handleTabChange("register")}
                    >
                        Usuario
                    </button>
                    <button
                        type="button"
                        className={`${styles["modal__tab-link"]} ${activeTab === "pet"
                            ? styles["modal__tab-link--active"]
                            : ""
                        }`}
                        onClick={() => handleTabChange("pet")}
                    >
                        Mascotas
                    </button>
                </div>
                {successMessage && (
                    <div className={styles["modal__success-message"]}>
                        {successMessage}
                    </div>
                )}
                <div className={styles["modal__tab-content"]}>
                    <form
                        style={{ display: activeTab === "register" ? "block" : "none" }}
                        autoComplete="off"
                    >
                        {[
                            { field: "name", label: "Nombre", placeholder: "Nombre completo" },
                            { field: "dni", label: "DNI", placeholder: "DNI o NIE" },
                            { field: "email", label: "Correo Electrónico", placeholder: "Correo electrónico" },
                            { field: "phone", label: "Teléfono", placeholder: "Teléfono" },
                            { field: "password", label: "Contraseña", placeholder: "Contraseña" },
                            { field: "confirmPassword", label: "Confirmar Contraseña", placeholder: "Confirmar contraseña" },
                        ].map(({ field, label, placeholder }) => (
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
                                    placeholder={placeholder}
                                    autoComplete="off"
                                />
                                {formErrors[field] && (
                                    <span
                                        className="input-error-message"
                                        style={{ fontSize: "10px" }}
                                    >
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
                        <button
                            type="button"
                            className="btn-filled"
                            onClick={handleContinue}
                        >
                            Continuar
                        </button>
                    </form>
                    <form
                        style={{ display: activeTab === "pet" ? "block" : "none" }}
                        autoComplete="off"
                    >
                        {pets.map((pet, index) => (
                            <div key={index} className={styles["pet-block"]}>
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
    );
};

export default ModalComponent;