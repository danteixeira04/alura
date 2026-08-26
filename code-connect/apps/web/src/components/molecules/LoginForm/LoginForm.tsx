import { useState, type FormEvent } from 'react';
import { Button } from '../../atoms/Button';
import { Checkbox } from '../../atoms/Checkbox';
import { TextField } from '../../atoms/TextField';

export type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

type LoginFormProps = {
  defaultValues?: Partial<LoginFormValues>;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
  onForgotPassword?: () => void;
};

const DEFAULTS: LoginFormValues = {
  email: '',
  password: '',
  remember: false,
};

export function LoginForm({
  defaultValues,
  isSubmitting = false,
  errorMessage,
  onSubmit,
  onForgotPassword,
}: LoginFormProps) {
  const [values, setValues] = useState<LoginFormValues>({ ...DEFAULTS, ...defaultValues });

  const handleFieldChange = (name: keyof LoginFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value, type, checked } = event.target;
      setValues((current) => ({
        ...current,
        [name]: type === 'checkbox' ? checked : value,
      }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSubmit(values);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} aria-label="Formulário de login">
      <TextField
        label="Email ou usuário"
        name="email"
        type="email"
        autoComplete="username"
        placeholder="usuario123"
        value={values.email}
        onChange={handleFieldChange('email')}
      />

      <TextField
        label="Senha"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        value={values.password}
        onChange={handleFieldChange('password')}
      />

      <div className="flex items-center justify-between gap-2 text-sm text-[#c7d1d2]">
        <Checkbox
          label="Lembrar-me"
          name="remember"
          checked={values.remember}
          onChange={handleFieldChange('remember')}
        />

        {onForgotPassword && (
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-[#7df5ab] hover:text-[#9fffba]"
          >
            Esqueci a senha
          </button>
        )}
      </div>

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
        {isSubmitting ? 'Entrando...' : 'Login'}
        {!isSubmitting && (
          <img src="/assets/arrow-forward.png" alt="" aria-hidden="true" className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
