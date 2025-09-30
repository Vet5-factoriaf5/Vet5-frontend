import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginModal from "../components/loginmodal/LoginModal"; // Asegúrate de que la ruta sea correcta

describe("LoginModal", () => {
    const mockOnClose = vi.fn();
    const mockUsers = [
        { dni: "12345678A", email: "user@example.com", password: "Password1!" }
    ];

    // Limpia los mocks antes de cada test para evitar interferencias
    beforeEach(() => {
        mockOnClose.mockClear();
        // Si usas timers, es buena práctica limpiarlos también
        vi.useRealTimers(); 
    });

    it("debe renderizar correctamente cuando isOpen es true", () => {
        render(<LoginModal isOpen={true} onClose={mockOnClose} users={mockUsers} />);
        expect(screen.getByRole("heading", { name: /Iniciar Sesión/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/DNI/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
        expect(screen.getByTestId("login-button")).toBeInTheDocument();
    });

    it("permite escribir en los campos de DNI y Contraseña", () => {
        render(<LoginModal isOpen={true} onClose={mockOnClose} users={mockUsers} />);
        const dniInput = screen.getByLabelText(/DNI/i);
        const passwordInput = screen.getByLabelText(/Contraseña/i);

        fireEvent.change(dniInput, { target: { value: "12345678A" } });
        fireEvent.change(passwordInput, { target: { value: "Password1!" } });

        expect(dniInput.value).toBe("12345678A");
        expect(passwordInput.value).toBe("Password1!");
    });

    it("login correcto: muestra mensaje de éxito y cierra el modal tras timeout", () => {
        // 1. Activar temporizadores falsos
        vi.useFakeTimers();
        render(<LoginModal isOpen={true} onClose={mockOnClose} users={mockUsers} closeDelay={2000} />);

        // 2. Simular la acción del usuario
        fireEvent.change(screen.getByLabelText(/DNI/i), { target: { value: "12345678A" } });
        fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: "Password1!" } });
        fireEvent.click(screen.getByTestId("login-button"));

        // 3. Verificar que el mensaje de éxito aparece inmediatamente
        expect(screen.getByText(/¡Inicio de sesión exitoso!/i)).toBeInTheDocument();

        // 4. Avanzar el tiempo manualmente para disparar el setTimeout
        vi.advanceTimersByTime(2000);

        // 5. Verificar que la función para cerrar el modal fue llamada
        expect(mockOnClose).toHaveBeenCalledTimes(1);

        // 6. Volver a los temporizadores reales (buena práctica)
        vi.useRealTimers();
    });

    it("login incorrecto: muestra mensaje de error y no cierra el modal", () => {
        // 1. Activar temporizadores falsos
        vi.useFakeTimers();
        render(<LoginModal isOpen={true} onClose={mockOnClose} users={mockUsers} closeDelay={2000} />);

        // 2. Simular la acción del usuario con datos incorrectos
        fireEvent.change(screen.getByLabelText(/DNI/i), { target: { value: "wrong" } });
        fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: "wrong" } });
        fireEvent.click(screen.getByTestId("login-button"));

        // 3. Verificar que el mensaje de error aparece inmediatamente
        expect(screen.getByText(/Usuario o contraseña incorrectos/i)).toBeInTheDocument();

        // 4. Avanzar el tiempo para confirmar que el modal NO se cierra
        vi.advanceTimersByTime(2000);
        
        // 5. Verificar que la función para cerrar el modal NO fue llamada
        expect(mockOnClose).not.toHaveBeenCalled();

        // 6. Volver a los temporizadores reales
        vi.useRealTimers();
    });

    it("no renderiza el modal cuando isOpen es false", () => {
        render(<LoginModal isOpen={false} onClose={mockOnClose} users={mockUsers} />);
        // Usamos queryBy... porque esperamos que el elemento no esté en el DOM
        expect(screen.queryByRole("heading", { name: /Iniciar Sesión/i })).not.toBeInTheDocument();
    });
});
