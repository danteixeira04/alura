import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('submete email e senha preenchidos', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <LoginForm
        defaultValues={{ email: 'demo@codeconnect.com', password: 'demo123' }}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'demo@codeconnect.com',
      password: 'demo123',
      remember: false,
    });
  });

  it('mostra mensagem de erro e desabilita botão enquanto submitting', () => {
    render(<LoginForm onSubmit={vi.fn()} isSubmitting errorMessage="Credenciais inválidas" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Credenciais inválidas');
    expect(screen.getByRole('button', { name: /entrando/i })).toBeDisabled();
  });
});
