import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AuthSwitchLink } from './AuthSwitchLink';

describe('AuthSwitchLink', () => {
  it('renderiza mensagem e ação, disparando callback ao clicar', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <AuthSwitchLink message="Ainda não tem conta?" actionLabel="Crie seu cadastro!" onClick={onClick} />,
    );

    expect(screen.getByText(/ainda não tem conta\?/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /crie seu cadastro/i }));
    expect(onClick).toHaveBeenCalled();
  });
});
