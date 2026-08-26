import { forwardRef, useId, useState, type InputHTMLAttributes } from 'react';

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label: string;
  errorMessage?: string;
  hidePasswordToggle?: boolean;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { label, errorMessage, hidePasswordToggle = false, type = 'text', id, className = '', ...rest },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const isPasswordField = type === 'password' && !hidePasswordToggle;
    const effectiveType = isPasswordField && isPasswordVisible ? 'text' : type;
    const describedBy = errorMessage ? `${inputId}-error` : undefined;

    return (
      <div className="w-full">
        <label htmlFor={inputId} className="block text-sm font-medium text-[#dfe7e8]">
          {label}
          <div className="relative mt-2">
            <input
              id={inputId}
              ref={ref}
              type={effectiveType}
              aria-invalid={errorMessage ? true : undefined}
              aria-describedby={describedBy}
              className={`w-full rounded-lg border border-[#2a3a45] bg-[#2f3b43] px-3 py-3 text-sm text-white outline-none placeholder:text-[#a7b4b8] focus:border-[#7df5ab] ${
                isPasswordField ? 'pr-16' : ''
              } ${className}`.trim()}
              {...rest}
            />
            {isPasswordField && (
              <button
                type="button"
                onClick={() => setIsPasswordVisible((current) => !current)}
                aria-label={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
                aria-pressed={isPasswordVisible}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-medium text-[#a7b4b8] hover:text-[#7df5ab]"
              >
                {isPasswordVisible ? 'Ocultar' : 'Mostrar'}
              </button>
            )}
          </div>
        </label>
        {errorMessage && (
          <p id={`${inputId}-error`} role="alert" className="mt-2 text-sm text-red-300">
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);
