import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RegisterForm } from './RegisterForm';

describe('RegisterForm', () => {
  it('submete os valores do formulário de cadastro', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<RegisterForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Nome'), 'Ada Lovelace');
    await user.type(screen.getByLabelText('Email'), 'ada@codeconnect.com');
    await user.type(screen.getByLabelText('Senha'), 'secret1');
    await user.type(screen.getByLabelText('Confirmar senha'), 'secret1');

    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      email: 'ada@codeconnect.com',
      password: 'secret1',
      confirmPassword: 'secret1',
    });
  });

  it('exibe mensagem de erro e desabilita botão quando submitting', () => {
    render(<RegisterForm onSubmit={vi.fn()} isSubmitting errorMessage="Falha" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Falha');
    expect(screen.getByRole('button', { name: /criando conta/i })).toBeDisabled();
  });
});
