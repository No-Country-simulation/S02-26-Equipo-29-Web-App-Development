import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

type InputLoginProps = InputHTMLAttributes<HTMLInputElement>;

export const InputLogin = forwardRef<HTMLInputElement, InputLoginProps>(
  ({ className = "", ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-2xl border border-[var(--color-border)] bg-transparent px-4 py-3 text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 ${className}`.trim()}
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
        className={`w-full rounded-2xl border border-[var(--color-border)] bg-transparent px-4 py-3 text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 ${className}`.trim()}
        {...rest}
      />
    );
  },
);

InputSignUp.displayName = "InputSignUp";
