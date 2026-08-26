import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Divider } from './Divider';

describe('Divider', () => {
  it('renderiza apenas a linha quando não há children', () => {
    render(<Divider />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('renderiza o texto centralizado quando há children', () => {
    render(<Divider>ou entre com outras contas</Divider>);
    expect(screen.getByText('ou entre com outras contas')).toBeInTheDocument();
  });
});
