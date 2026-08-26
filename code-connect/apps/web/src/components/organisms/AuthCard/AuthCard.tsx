import type { ReactNode } from 'react';
import { AuthSidebar } from '../AuthSidebar';

export type AuthVariant = 'login' | 'register';

type AuthCardProps = {
  variant: AuthVariant;
  sidebarImageSrc: string;
  sidebarImageAlt?: string;
  children: ReactNode;
};

export function AuthCard({ variant, sidebarImageSrc, sidebarImageAlt, children }: AuthCardProps) {
  const title = variant === 'login' ? 'Login' : 'Criar conta';
  const subtitle =
    variant === 'login' ? 'Boas-vindas! Faça seu login.' : 'Crie sua conta para começar.';

  return (
    <div className="relative z-10 flex w-full max-w-5xl overflow-hidden rounded-[30px] border border-[#28464b] bg-[#111c24]/95 shadow-[0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-12 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full border border-[#1b4d4c] opacity-60" />
        <div className="absolute -right-12 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full border border-[#1b4d4c] opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(110,255,160,0.09),transparent_60%)]" />
      </div>

      <AuthSidebar imageSrc={sidebarImageSrc} {...(sidebarImageAlt ? { imageAlt: sidebarImageAlt } : {})} />

      <div className="relative w-full p-6 sm:p-8 md:w-[54%] md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#f3f7f5]">{title}</h1>
          <p className="mt-2 text-base text-[#9faeb3]">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  );
}
