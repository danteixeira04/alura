import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SocialAuthGroup } from './SocialAuthGroup';

describe('SocialAuthGroup', () => {
  it('dispara callbacks dos botões sociais', async () => {
    const user = userEvent.setup();
    const onGoogle = vi.fn();
    const onGithub = vi.fn();

    render(<SocialAuthGroup onGoogle={onGoogle} onGithub={onGithub} />);

    await user.click(screen.getByRole('button', { name: /google/i }));
    await user.click(screen.getByRole('button', { name: /github/i }));

    expect(onGoogle).toHaveBeenCalledTimes(1);
    expect(onGithub).toHaveBeenCalledTimes(1);
  });
});
