
import { useForm } from "react-hook-form";
import { InputSignUp } from "../UI/input";
import { useState } from "react";
import { Login } from "./LogIn";

type SignUpFormValues = {
  email: string;
  password: string;
    name: string;
    lastname: string;
    phone: number;
};

export const SignUp = () => {
  const [Mode, setMode] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      lastname: "",
      phone: 0,
    },
    mode: "onBlur",
  });

  const onSubmit = handleSubmit((values) => {
    console.log("SignUp payload", values);
  });

  return (
    <>
    {Mode ? <Login /> : (
    <section className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl p-8">
        <div className="space-y-2 text-center mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-[var(--color-text-secondary)]">
            Bienvenido
          </p>
          <h1 className="text-3xl font-semibold text-[var(--color-text-primary)]">
            Crea una cuenta
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Ingresa tu correo y contraseña para continuar
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text-primary)]" htmlFor="email">
              Correo electrónico
            </label>

            <InputSignUp
              id="email"
              type="email"
              placeholder="nombre@empresa.com"
                {...register("email", {
                    required: "El correo es obligatorio",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Ingresa un correo válido",
                    },
                  })}
            />

            {errors.email && (
              <p className="text-sm text-[var(--color-danger)]">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text-primary)]" htmlFor="password">
              Contraseña
            </label>
            <InputSignUp 
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 6,
                  message: "Debe tener al menos 6 caracteres",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-[var(--color-danger)]">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text-primary)]" htmlFor="name">
              Nombre
            </label>
            <InputSignUp 
              id="name"
              type="text"
              placeholder="Nombre completo"
              {...register("name", {
                required: "El nombre es obligatorio",
                minLength: {
                  value: 6,
                  message: "Debe tener al menos 6 caracteres",
                },
              })}
            />
            {errors.name && (
              <p className="text-sm text-[var(--color-danger)]">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text-primary)]" htmlFor="lastname">
              Apellido
            </label>
            <InputSignUp 
              id="lastname"
              type="text"
              placeholder="Apellido completo"
              {...register("lastname", {
                required: "El apellido es obligatorio",
                minLength: {
                  value: 6,
                  message: "Debe tener al menos 6 caracteres",
                },
              })}
            />
            {errors.lastname && (
              <p className="text-sm text-[var(--color-danger)]">{errors.lastname.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text-primary)]" htmlFor="phone">
              Telefono
            </label>
            <InputSignUp 
              id="phone"
              type="number"
              placeholder="••••••••"
              {...register("phone", {
                required: "El teléfono es obligatorio",
                minLength: {
                  value: 6,
                  message: "Debe tener al menos 6 caracteres",
                },
              })}
            />
            {errors.phone && (
              <p className="text-sm text-[var(--color-danger)]">{errors.phone.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-white font-medium transition hover:bg-[var(--color-primary-hover)] disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Ingresando..." : "Crear Cuenta"}
          </button>

          <button
            onClick={() => setMode(!Mode)}
            className="w-full rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-white font-medium transition hover:bg-[var(--color-primary-hover)] disabled:opacity-70"

          >
            {isSubmitting ? "Ingresando..." : "Tengo una Cuenta"}
          </button>

        </form>
      </div>
    </section>
        )}
    </>
  );
};