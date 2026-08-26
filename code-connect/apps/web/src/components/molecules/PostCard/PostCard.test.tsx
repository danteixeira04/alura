import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PostCard } from './PostCard';

const post = {
  id: 'post-1',
  title: 'Aprender React com testes reais',
  content: 'A melhor forma de evoluir é praticar com cenários reais e validar feedback constante.',
  author: 'Maria Silva',
  tags: ['react', 'testing', 'frontend'],
  createdAt: '2026-08-20T12:00:00.000Z',
};

describe('PostCard', () => {
  it('renders the post details and tags', () => {
    render(
      <PostCard
        post={post}
        onDelete={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Aprender React com testes reais' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    expect(screen.getByText('#react')).toBeInTheDocument();
    expect(screen.getByText('#testing')).toBeInTheDocument();
  });
});
