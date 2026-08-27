import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Home } from './Home';

const mockPosts = [
  {
    id: '1',
    title: 'Boas práticas em APIs REST',
    content: 'Estruture endpoints por recursos e mantenha respostas consistentes.',
    author: 'Ana Souza',
    tags: ['rest', 'backend'],
    createdAt: '2026-08-20T01:00:00.000Z',
  },
];

describe('Home page', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);

        if (url.includes('/auth/login')) {
          return Promise.resolve({
            ok: true,
            text: async () =>
              JSON.stringify({
                user: { id: 'user-1', name: 'Demo User', email: 'demo@codeconnect.com' },
                access_token: 'test-token',
              }),
          } as Response);
        }

        if (url.includes('/posts') && init?.method === 'POST') {
          return Promise.resolve({
            ok: true,
            text: async () =>
              JSON.stringify({
                ...JSON.parse(String(init.body)),
                id: '2',
                createdAt: '2026-08-20T02:00:00.000Z',
              }),
          } as Response);
        }

        return Promise.resolve({
          ok: true,
          text: async () => JSON.stringify(mockPosts),
        } as Response);
      }),
    );
  });

  afterEach(() => {
    window.localStorage.clear();
    vi.unstubAllGlobals();
  });

  it('renders the login screen with the expected fields', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email ou usuário')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('logs in and shows the authenticated feed', async () => {
    render(<Home />);

    fireEvent.change(screen.getByLabelText('Email ou usuário'), {
      target: { value: 'demo@codeconnect.com' },
    });
    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'demo123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Conectado como')).toBeInTheDocument();
    });

    expect(await screen.findByRole('heading', { name: 'Code Connect' })).toBeInTheDocument();
  });
});