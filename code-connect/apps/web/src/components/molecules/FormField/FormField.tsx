import type { ReactNode } from 'react';

type FormFieldProps = {
  id?: string;
  label: string;
  htmlFor: string;
  errorMessage?: string;
  children: ReactNode;
};

export function FormField({ label, htmlFor, errorMessage, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-[#dfe7e8]">
        {label}
      </label>
      {children}
      {errorMessage && (
        <p role="alert" className="text-sm text-red-300">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
