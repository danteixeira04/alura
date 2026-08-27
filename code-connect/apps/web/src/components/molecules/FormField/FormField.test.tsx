import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormField } from './FormField';

describe('FormField', () => {
  it('associa o label ao children via htmlFor', () => {
    render(
      <FormField label="Nome" htmlFor="name">
        <input id="name" />
      </FormField>,
    );

    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
  });

  it('exibe a mensagem de erro quando informada', () => {
    render(
      <FormField label="Nome" htmlFor="name" errorMessage="Obrigatório">
        <input id="name" />
      </FormField>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Obrigatório');
  });
});
