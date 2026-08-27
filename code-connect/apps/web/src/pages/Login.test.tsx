import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { Login } from './Login';

vi.mock('../../services/auth', () => ({
  login: vi.fn().mockResolvedValue({
    user: { id: '1', name: 'Demo', email: 'demo@codeconnect.com' },
    access_token: 'token',
  }),
}));

describe('Login page', () => {
  it('renderiza titulo e campos do formulario de login', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /login/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByLabelText(/email ou usu/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /github/i })).toBeInTheDocument();
  });
});
