import { useState, type FormEvent } from 'react';
import { Button } from '../../atoms/Button';
import { TextField } from '../../atoms/TextField';

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterFormProps = {
  isSubmitting?: boolean;
  errorMessage?: string | null;
  onSubmit: (values: RegisterFormValues) => void | Promise<void>;
};

const DEFAULTS: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export function RegisterForm({ isSubmitting = false, errorMessage, onSubmit }: RegisterFormProps) {
  const [values, setValues] = useState<RegisterFormValues>(DEFAULTS);

  const handleFieldChange = (name: keyof RegisterFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValues((current) => ({ ...current, [name]: value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSubmit(values);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} aria-label="Formulário de cadastro">
      <TextField
        label="Nome"
        name="name"
        autoComplete="name"
        placeholder="Seu nome"
        value={values.name}
        onChange={handleFieldChange('name')}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="seu@email.com"
        value={values.email}
        onChange={handleFieldChange('email')}
      />
      <TextField
        label="Senha"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="Crie uma senha"
        value={values.password}
        onChange={handleFieldChange('password')}
      />
      <TextField
        label="Confirmar senha"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        placeholder="Repita a senha"
        value={values.confirmPassword}
        onChange={handleFieldChange('confirmPassword')}
      />

      {errorMessage && (
        <p
          role="alert"
          className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200"
        >
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7df5ab] px-4 py-3 text-base font-semibold text-[#071d1a] shadow-[0_8px_24px_rgba(125,245,171,0.38)] hover:bg-[#9fffba]"
      >
        {isSubmitting ? 'Criando conta...' : 'Criar conta'}
      </Button>
    </form>
  );
}
