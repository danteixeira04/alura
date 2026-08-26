import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard } from '../../components/organisms/AuthCard';
import { AuthSwitchLink } from '../../components/molecules/AuthSwitchLink';
import { LoginForm, type LoginFormValues } from '../../components/molecules/LoginForm';
import { SocialAuthGroup } from '../../components/molecules/SocialAuthGroup';
import { AuthTemplate } from '../../components/templates/AuthTemplate';
import { login } from '../../services/auth';

export function Login() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await login(values.email, values.password);
      navigate('/');
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível autenticar o usuário.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthTemplate>
      <AuthCard variant="login" sidebarImageSrc="/assets/login-banner.png">
        <LoginForm
          defaultValues={{ email: 'demo@codeconnect.com', password: 'demo123' }}
          isSubmitting={isSubmitting}
          errorMessage={error}
          onSubmit={handleSubmit}
        />

        <SocialAuthGroup
          onGoogle={() => setError('Login com Google ainda não está habilitado.')}
          onGithub={() => setError('Login com GitHub ainda não está habilitado.')}
        />

        <AuthSwitchLink
          message="Ainda não tem conta?"
          actionLabel="Crie seu cadastro!"
          onClick={() => navigate('/register')}
        />

        <p className="mt-4 text-center text-xs text-[#7e8c92]">
          <Link to="/" className="hover:text-[#7df5ab]">
            Voltar para o feed
          </Link>
        </p>
      </AuthCard>
    </AuthTemplate>
  );
}

export default Login;