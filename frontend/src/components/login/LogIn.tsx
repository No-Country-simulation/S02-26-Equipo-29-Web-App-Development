import { useForm } from "react-hook-form";
import { InputLogin } from "../UI/input";
import { useState } from "react";
import { SignUp } from "./SignUp";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/axios/api";

type LoginFormValues = {
  email?: string;
  password?: string;
  token?: string;
};

export const Login = () => {
  const navigate = useNavigate();
  const [Mode, setMode] = useState(false);
  const [, setUserToken] = useState<LoginFormValues | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (values: LoginFormValues) => {
    if (values) {
      const response = await api.post<LoginFormValues>("/auth/login", values);
      if (response.status === 201) {
        console.log("Login exitoso:", response.data);
        setUserToken(response.data);
        localStorage.setItem("userToken", JSON.stringify(response.data));
        navigate("/dashboard");
      } else {
        console.error("Error en el login:", response.statusText);
        console.error("Response data:", response.data);
      }
    }
  });

  return (
    <>
      {Mode ? (
        <SignUp />
      ) : (
        <section className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md rounded-3xl border border-border bg-surface shadow-xl p-8">
            <div className="space-y-2 text-center mb-8">
              <p className="text-sm uppercase tracking-[0.25em] text-text-secondary">
                Bienvenido
              </p>
              <h1 className="text-3xl font-semibold text-text-primary">
                Inicia sesión
              </h1>
              <p className="text-sm text-text-secondary">
                Ingresa tu correo y contraseña para continuar
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-text-primary"
                  htmlFor="email"
                >
                  Correo electrónico
                </label>

                <InputLogin
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
                  <p className="text-sm text-danger">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-text-primary"
                  htmlFor="password"
                >
                  Contraseña
                </label>
                <InputLogin
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
                  <p className="text-sm text-danger">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-primary px-4 py-3 text-white font-medium transition hover:bg-primary-hover disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Ingresando..." : "Entrar"}
              </button>
              <button
                onClick={() => setMode(!Mode)}
                className="w-full rounded-2xl bg-primary px-4 py-3 text-white font-medium transition hover:bg-primary-hover disabled:opacity-70"
              >
                {isSubmitting ? "Ingresando..." : "Crear una cuenta"}
              </button>
            </form>
          </div>
        </section>
      )}
    </>
  );
};
