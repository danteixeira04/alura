import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders title and description', () => {
    render(<Card title="Título" description="Descrição" />);
    expect(screen.getByRole('heading', { name: 'Título' })).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
  });

  it('renders the action button when actionLabel and onAction are provided', async () => {
    const onAction = vi.fn();
    const user = userEvent.setup();
    render(
      <Card title="T" actionLabel="Abrir" onAction={onAction} />,
    );
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    expect(onAction).toHaveBeenCalled();
  });

  it('does not render the action button when actionLabel is missing', () => {
    render(<Card title="T" onAction={() => {}} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});