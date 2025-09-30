import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react'; // <--- act importado
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import Modal from '../components/modal/Modal.jsx';

// ... (el helper fillValidUserData no cambia)
const fillValidUserData = () => {
    fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'Usuario Válido' } });
    fireEvent.change(screen.getByTestId('input-dni'), { target: { value: '12345678A' } });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('input-phone'), { target: { value: '600123456' } });
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByTestId('input-confirmPassword'), { target: { value: 'Password123!' } });
};


describe('Modal Component', () => {
    // ... (beforeEach y los primeros tests no cambian)
    let onCloseMock;
    let onRegisterMock;

    beforeEach(() => {
        onCloseMock = vi.fn();
        onRegisterMock = vi.fn();
        render(<Modal isOpen={true} onClose={onCloseMock} onRegister={onRegisterMock} />);
    });

    test('cierra el modal al hacer click en el botón de cerrar', () => {
        fireEvent.click(screen.getByRole('button', { name: /cerrar/i }));
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    // ... (todos los describe y tests intermedios no cambian)
    describe('Formulario de Registro de Usuario', () => {
        test('muestra errores de validación con datos inválidos', () => {
            fireEvent.change(screen.getByTestId('input-dni'), { target: { value: 'invalido' } });
            fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'invalido' } });
            fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'pass' } });
            fireEvent.change(screen.getByTestId('input-confirmPassword'), { target: { value: 'diferente' } });

            expect(screen.getByText(/Formato DNI\/NIE inválido/i)).toBeInTheDocument();
            expect(screen.getByText(/Formato de correo inválido/i)).toBeInTheDocument();
            expect(screen.getByText(/Contraseña inválida/i)).toBeInTheDocument();
            expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeInTheDocument();
        });

        test('navega al siguiente campo al presionar Enter', () => {
            const nameInput = screen.getByTestId('input-name');
            const dniInput = screen.getByTestId('input-dni');
            nameInput.focus();
            fireEvent.keyDown(nameInput, { key: 'Enter', code: 'Enter', charCode: 13 });
            expect(dniInput).toHaveFocus();
        });

        test('no permite continuar a la pestaña de mascotas si hay errores', () => {
            fireEvent.change(screen.getByTestId('input-name'), { target: { value: '' } });
            fireEvent.click(screen.getByRole('button', { name: /Continuar/i }));
            const petForm = screen.getByTestId('input-pet-name-0').closest('form');
            expect(petForm).not.toBeVisible();
            expect(screen.getByText(/Nombre requerido/i)).toBeInTheDocument();
        });

        test('permite continuar a la pestaña de mascotas si el formulario es válido', () => {
            fillValidUserData();
            fireEvent.click(screen.getByRole('button', { name: /Continuar/i }));
            const petForm = screen.getByTestId('input-pet-name-0').closest('form');
            expect(petForm).toBeVisible();
        });
    });

    describe('Formulario de Registro de Mascotas', () => {
        beforeEach(() => {
            fillValidUserData();
            fireEvent.click(screen.getByRole('button', { name: /Continuar/i }));
        });

        test('permite añadir un nuevo formulario de mascota', () => {
            fireEvent.click(screen.getByTestId('btn-add-mascota'));
            expect(screen.getByTestId('input-pet-name-0')).toBeInTheDocument();
            expect(screen.getByTestId('input-pet-name-1')).toBeInTheDocument();
        });

        test('permite rellenar los datos de una mascota', () => {
            fireEvent.change(screen.getByTestId('input-pet-name-0'), { target: { value: 'Fido' } });
            fireEvent.change(screen.getByTestId('input-pet-species-0'), { target: { value: 'Perro' } });
            fireEvent.click(screen.getByTestId('input-pet-gender-macho-0'));
            expect(screen.getByTestId('input-pet-name-0')).toHaveValue('Fido');
            expect(screen.getByTestId('input-pet-species-0')).toHaveValue('Perro');
            expect(screen.getByTestId('input-pet-gender-macho-0')).toBeChecked();
        });
    });

    describe('Envío del Formulario Completo', () => {
        beforeEach(() => {
            vi.useFakeTimers();
            fillValidUserData();
            fireEvent.click(screen.getByRole('button', { name: /Continuar/i }));
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        test('muestra un error si se intenta registrar sin datos de mascota y luego lo oculta', () => {
            fireEvent.click(screen.getByTestId('btn-registrarse'));
            expect(screen.getByText(/Por favor, completa al menos el nombre y tipo de una mascota/i)).toBeInTheDocument();
            
            // CORRECCIÓN: Envolver en act
            act(() => {
                vi.advanceTimersByTime(3000);
            });
            expect(screen.queryByText(/Por favor, completa al menos el nombre y tipo de una mascota/i)).not.toBeInTheDocument();
        });

        test('registra, llama a onRegister y cierra el modal con datos válidos', () => {
            fireEvent.change(screen.getByTestId('input-pet-name-0'), { target: { value: 'Fido' } });
            fireEvent.change(screen.getByTestId('input-pet-species-0'), { target: { value: 'Perro' } });
            fireEvent.click(screen.getByTestId('btn-registrarse'));
            expect(screen.getByText(/¡Usuario y mascotas registradas con éxito!/i)).toBeInTheDocument();
            expect(onRegisterMock).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Usuario Válido',
                pets: expect.arrayContaining([expect.objectContaining({ name: 'Fido', species: 'Perro' })])
            }));

            // CORRECCIÓN: Envolver en act
            act(() => {
                vi.advanceTimersByTime(3000);
            });
            expect(onCloseMock).toHaveBeenCalledTimes(1);
        });
    });

    describe('Navegación por Pestañas', () => {
        test('permite volver a la pestaña de usuario desde la pestaña de mascotas', () => {
            fillValidUserData();
            fireEvent.click(screen.getByRole('button', { name: /Continuar/i }));
            const petForm = screen.getByTestId('input-pet-name-0').closest('form');
            expect(petForm).toBeVisible();
            fireEvent.click(screen.getByRole('button', { name: /Usuario/i }));
            const userForm = screen.getByTestId('input-name').closest('form');
            expect(userForm).toBeVisible();
            expect(petForm).not.toBeVisible();
        });
    });
});
