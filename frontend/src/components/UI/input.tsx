import { forwardRef } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

type InputLoginProps = InputHTMLAttributes<HTMLInputElement>;

export const InputLogin = forwardRef<HTMLInputElement, InputLoginProps>(
  ({ className = "", ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${className}`.trim()}
        {...rest}
      />
    );
  },
);

InputLogin.displayName = "InputLogin";

type InputSignUpProps = InputHTMLAttributes<HTMLInputElement>;

export const InputSignUp = forwardRef<HTMLInputElement, InputSignUpProps>(
  ({ className = "", ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${className}`.trim()}
        {...rest}
      />
    );
  },
);

InputSignUp.displayName = "InputSignUp";

type InputOptionsProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
};

export const InputOptions = forwardRef<HTMLSelectElement, InputOptionsProps>(
  ({ className = "", options, ...rest }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${className}`.trim()}
        {...rest}
      >
        <option value="" disabled selected>
          Selecciona una opción
        </option>
        {options.map(({ value, label, disabled }) => (
          <option key={value} value={value} disabled={disabled}
            className="bg-background text-text-primary font-medium rounded-2xl px-4 py-3 text-sm transition hover:bg-primary-hover disabled:opacity-70">
            {label}
          </option>
        ))}
      </select>
    );
  },
);

InputOptions.displayName = "InputOptions";