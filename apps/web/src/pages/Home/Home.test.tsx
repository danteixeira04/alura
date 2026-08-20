import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Home } from './Home';

describe('Home page', () => {
  it('renders o título e o primeiro card', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', { name: 'Code Connect' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Primeiro Card' }),
    ).toBeInTheDocument();
  });
});