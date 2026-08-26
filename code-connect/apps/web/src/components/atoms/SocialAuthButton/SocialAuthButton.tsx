import type { ButtonHTMLAttributes } from 'react';

type SocialProvider = 'google' | 'github';

type SocialAuthButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  provider: SocialProvider;
  label: string;
};

const PROVIDER_ICON: Record<SocialProvider, string> = {
  google: '/assets/google.png',
  github: '/assets/github.png',
};

export function SocialAuthButton({ provider, label, className = '', ...rest }: SocialAuthButtonProps) {
  return (
    <button
      type="button"
      data-provider={provider}
      className={`flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#2a3941] bg-[#1b262d] px-3 py-2.5 text-sm font-medium text-[#edf3f4] transition-colors hover:border-[#7df5ab]/60 ${className}`.trim()}
      {...rest}
    >
      <img src={PROVIDER_ICON[provider]} alt="" aria-hidden="true" className="h-5 w-5" />
      {label}
    </button>
  );
}
