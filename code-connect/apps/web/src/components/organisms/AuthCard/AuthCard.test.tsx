import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthCard } from './AuthCard';

describe('AuthCard', () => {
  it('renderiza título e subtítulo conforme a variante', () => {
    render(
      <AuthCard variant="login" sidebarImageSrc="/assets/login-banner.png">
        <p>conteúdo</p>
      </AuthCard>,
    );

    expect(screen.getByRole('heading', { name: /login/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/faça seu login/i)).toBeInTheDocument();
    expect(screen.getByText('conteúdo')).toBeInTheDocument();
  });

  it('altera o título para variante register', () => {
    render(
      <AuthCard variant="register" sidebarImageSrc="/assets/login-banner.png">
        <p>conteúdo</p>
      </AuthCard>,
    );

    expect(screen.getByRole('heading', { name: /criar conta/i, level: 1 })).toBeInTheDocument();
  });
});
