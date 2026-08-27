import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HomeTemplate } from './HomeTemplate';

describe('HomeTemplate', () => {
  it('renders header and content', () => {
    render(
      <HomeTemplate header={<h1>Header</h1>}>
        <p>Conteúdo</p>
      </HomeTemplate>,
    );
    expect(screen.getByRole('heading', { name: 'Header' })).toBeInTheDocument();
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
  });
});