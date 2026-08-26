import { useId, type InputHTMLAttributes, type ReactNode } from 'react';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: ReactNode;
};

export function Checkbox({ label, id, className = '', ...rest }: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <label
      htmlFor={inputId}
      className={`inline-flex cursor-pointer items-center gap-2 text-sm text-[#c7d1d2] ${className}`.trim()}
    >
      <input
        id={inputId}
        type="checkbox"
        className="h-4 w-4 rounded border-[#3c4e58] bg-[#1b2a31] text-[#7df5ab] accent-[#7df5ab]"
        {...rest}
      />
      <span>{label}</span>
    </label>
  );
}
