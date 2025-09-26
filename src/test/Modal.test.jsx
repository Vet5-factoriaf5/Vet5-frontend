import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ModalComponent from "../components/modal/Modal";

describe("ModalComponent", () => {
    it("muestra mensaje de éxito al registrar usuario y mascota", async () => {
        render(<ModalComponent isOpen={true} onClose={() => {}} />);

        // --- FORMULARIO DE USUARIO ---
        fireEvent.change(screen.getByTestId("input-name"), { target: { value: "Paula" } });
        fireEvent.change(screen.getByTestId("input-dni"), { target: { value: "12345678A" } });
        fireEvent.change(screen.getByTestId("input-email"), { target: { value: "paula@example.com" } });
        fireEvent.change(screen.getByTestId("input-phone"), { target: { value: "600123456" } });
        fireEvent.change(screen.getByTestId("input-password"), { target: { value: "Password1!" } });
        fireEvent.change(screen.getByTestId("input-confirmPassword"), { target: { value: "Password1!" } });

        fireEvent.click(screen.getByTestId("btn-continuar"));

        // --- FORMULARIO DE MASCOTAS ---
        fireEvent.click(screen.getByTestId("tab-mascotas"));
        fireEvent.change(screen.getByTestId("input-pet-name-0"), { target: { value: "Firulais" } });
        fireEvent.change(screen.getByTestId("input-pet-species-0"), { target: { value: "Perro" } });
        fireEvent.change(screen.getByTestId("input-pet-breed-0"), { target: { value: "Labrador" } });
        fireEvent.change(screen.getByTestId("input-pet-age-0"), { target: { value: 3 } });
        fireEvent.click(screen.getByTestId("input-pet-gender-macho-0"));

        fireEvent.click(screen.getByTestId("btn-registrarse"));

        // --- VERIFICAR MENSAJE DE ÉXITO ---
        const successMessage = await screen.findByText((content) =>
            content.includes("¡Usuario y mascotas registradas con éxito!")
        );

        expect(successMessage).toBeTruthy(); // Vitest acepta esto
    });
});