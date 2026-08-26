import type { ReactNode } from 'react';

type AuthTemplateProps = {
  children: ReactNode;
};

export function AuthTemplate({ children }: AuthTemplateProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#021417] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[-6rem] top-1/2 h-[24rem] w-[24rem] -translate-y-1/2 rounded-full border border-[#1d4147] opacity-60" />
        <div className="absolute right-[-6rem] top-1/2 h-[24rem] w-[24rem] -translate-y-1/2 rounded-full border border-[#1d4147] opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(120,255,170,0.08),transparent_55%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center p-4 sm:p-8">
        {children}
      </div>
    </main>
  );
}
