import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthSidebar } from './AuthSidebar';

describe('AuthSidebar', () => {
  it('renderiza a imagem do banner', () => {
    render(<AuthSidebar imageSrc="/assets/login-banner.png" imageAlt="Banner ilustrativo" />);
    expect(screen.getByAltText('Banner ilustrativo')).toBeInTheDocument();
  });

  it('marca a imagem como aria-hidden quando não há alt', () => {
    render(<AuthSidebar imageSrc="/assets/login-banner.png" />);
    const img = screen.getByRole('img', { hidden: true });
    expect(img).toHaveAttribute('aria-hidden', 'true');
  });
});
