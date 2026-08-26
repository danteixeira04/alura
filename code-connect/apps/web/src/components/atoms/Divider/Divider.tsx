import type { ReactNode } from 'react';

type DividerProps = {
  children?: ReactNode;
};

export function Divider({ children }: DividerProps) {
  if (!children) {
    return <div className="h-px w-full bg-[#2a3941]" role="separator" />;
  }

  return (
    <div
      className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[#7e8c92]"
      role="separator"
    >
      <div className="h-px flex-1 bg-[#2a3941]" />
      <span>{children}</span>
      <div className="h-px flex-1 bg-[#2a3941]" />
    </div>
  );
}
