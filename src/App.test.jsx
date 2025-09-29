import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
    it('should render the main heading in App', () => {
        render(<App />);
        const heading = screen.getByRole('heading', { name: /el amor que los une, el cuidado que nos inspira./i });
        expect(heading).toBeInTheDocument();
    });
});
