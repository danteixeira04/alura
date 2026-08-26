import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { TextField } from './TextField';

describe('TextField', () => {
  it('renderiza label e repassa props para o input', () => {
    render(<TextField label="E-mail" placeholder="voce@exemplo.com" name="email" />);

    expect(screen.getByText('E-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('voce@exemplo.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('voce@exemplo.com')).toHaveAttribute('name', 'email');
  });

  it('mostra e oculta senha ao clicar no botão', async () => {
    const user = userEvent.setup();
    render(<TextField label="Senha" type="password" name="password" />);

    const input = screen.getByLabelText('Senha') as HTMLInputElement;
    expect(input.type).toBe('password');

    await user.click(screen.getByRole('button', { name: /mostrar senha/i }));
    expect(input.type).toBe('text');

    await user.click(screen.getByRole('button', { name: /ocultar senha/i }));
    expect(input.type).toBe('password');
  });

  it('exibe mensagem de erro e marca aria-invalid', () => {
    render(<TextField label="E-mail" errorMessage="E-mail obrigatório" />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('E-mail obrigatório');
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true');
  });
});
