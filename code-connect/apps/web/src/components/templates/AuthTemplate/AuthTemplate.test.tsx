import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthTemplate } from './AuthTemplate';

describe('AuthTemplate', () => {
  it('renderiza o conteúdo dentro do layout escuro', () => {
    render(
      <AuthTemplate>
        <p>conteúdo</p>
      </AuthTemplate>,
    );

    expect(screen.getByText('conteúdo')).toBeInTheDocument();
  });
});
