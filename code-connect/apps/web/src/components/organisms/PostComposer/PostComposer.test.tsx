import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PostComposer } from './PostComposer';

describe('PostComposer', () => {
  it('submits the filled form data', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<PostComposer onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Título'), 'Nova ideia');
    await user.type(screen.getByLabelText('Conteúdo'), 'Preciso validar melhor a UX');
    await user.type(screen.getByLabelText('Autor'), 'Carlos');
    await user.type(screen.getByLabelText('Tags'), 'ux, product');

    await user.click(screen.getByRole('button', { name: 'Publicar' }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Nova ideia',
      content: 'Preciso validar melhor a UX',
      author: 'Carlos',
      tags: ['ux', 'product'],
    });
  });
});
