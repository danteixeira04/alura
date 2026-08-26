import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SocialAuthButton } from './SocialAuthButton';

describe('SocialAuthButton', () => {
  it('renderiza o label e o ícone do provedor', () => {
    render(<SocialAuthButton provider="google" label="Google" />);
    expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('data-provider', 'google');
  });

  it('dispara onClick ao clicar', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SocialAuthButton provider="github" label="GitHub" onClick={onClick} />);

    await user.click(screen.getByRole('button', { name: /github/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
