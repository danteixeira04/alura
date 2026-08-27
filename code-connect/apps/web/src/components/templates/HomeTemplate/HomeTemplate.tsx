import type { ReactNode } from 'react';

type HomeTemplateProps = {
  header: ReactNode;
  children: ReactNode;
};

export function HomeTemplate({ header, children }: HomeTemplateProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">{header}</header>
      <section>{children}</section>
    </main>
  );
}