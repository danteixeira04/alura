import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-violet-600 text-white hover:bg-violet-700',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
};

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}