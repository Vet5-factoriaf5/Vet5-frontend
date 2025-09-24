import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
    it('should render the heading "Hello, World!"', () => {
        // 1. ARRANGE (aka "given" or "setup"): Render the component.
        // The "render" function from React Testing Library renders the "App" Component
        // into a virtual DOM (provided by JSDOM).
        render(<App />);

        // 2. ACT (aka "when" or "do something"): In this simple case, we're just looking for an element.
        // "screen" gives us access to the "virtual DOOM". We use "getByRole" to find
        // the "heading" element, as this is a good practice for accessibility.
        const heading = screen.getByRole('heading', { name: /hello, world!/i });

        // 3. ASSERT (aka "then" or "check"): We make an assertion about the element.
        // The "toBeInTheDocument" matcher comes from the "@testing-library/jest-dom" library
        // and is a very readable way to confirm the element is present in the DOM.
        expect(heading).toBeInTheDocument();
    });
});
