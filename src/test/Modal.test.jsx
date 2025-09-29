import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import Modal from '../components/modal/Modal.jsx';

describe('Modal Component', () => {
    let onCloseMock;

    beforeEach(() => {
        onCloseMock = vi.fn();
        render(<Modal isOpen={true} onClose={onCloseMock} />);
    });

    test('muestra los inputs del formulario de usuario', () => {
        expect(screen.getByTestId('input-name')).toBeInTheDocument();
        expect(screen.getByTestId('input-email')).toBeInTheDocument();
        expect(screen.getByTestId('input-password')).toBeInTheDocument();
    });

    test('permite escribir en los campos de usuario', () => {
        fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'Margarita' } });
        fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'margarita@happypaws.es' } });
        fireEvent.change(screen.getByTestId('input-password'), { target: { value: '?Mg12345' } });

        expect(screen.getByTestId('input-name')).toHaveValue('Margarita');
        expect(screen.getByTestId('input-email')).toHaveValue('margarita@happypaws.es');
        expect(screen.getByTestId('input-password')).toHaveValue('?Mg12345');
    });

    test('cierra el modal al hacer click en "Cerrar"', () => {
        fireEvent.click(screen.getByRole('button', { name: /cerrar/i }));
        expect(onCloseMock).toHaveBeenCalled();
    });
});