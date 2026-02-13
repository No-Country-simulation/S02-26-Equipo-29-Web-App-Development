import { useForm } from "react-hook-form";
import { InputSignUp, InputOptions } from "../UI/input";
import { useState } from "react";
import { Login } from "./LogIn";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/axios/api";

type SignUpFormValues = {
  email: string;
  password: string;
  name: string;
  lastname: string;
  role: string;
};

export const SignUp = () => {
  const navigate = useNavigate();
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
      role: "",
    },
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (values) => {
    console.log("SignUp payload", values);

    const newUser = {
      email: values.email,
      password: values.password,
      full_name: `${values.name} ${values.lastname}`,
      role: values.role || "PATIENT",
    };

    try {
      const response = await api.post("/auth/register", newUser);
      console.log("SignUp response", response);
      if (response.status === 201) {
        console.log("SignUp exitoso:", response.data);
        setMode(true);
        navigate("/login");
      }
    } catch (error) {
      console.error("Error en el SignUp:", error);
    }
  });

  return (
    <>
      {Mode ? (
        <Login />
      ) : (
        <section className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md rounded-3xl border border-border bg-surface shadow-xl p-8">
            <div className="space-y-2 text-center mb-8">
              <p className="text-sm uppercase tracking-[0.25em] text-text-secondary">
                Bienvenido
              </p>
              <h1 className="text-3xl font-semibold text-text-primary">
                Crea una cuenta
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
                  <p className="text-sm text-danger">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-text-primary"
                  htmlFor="name"
                >
                  Nombre
                </label>
                <InputSignUp
                  id="name"
                  type="text"
                  placeholder="Nombre completo"
                  {...register("name", {
                    required: "El nombre es obligatorio",
                    minLength: {
                      value: 3,
                      message: "Debe tener al menos 3 caracteres",
                    },
                  })}
                />
                {errors.name && (
                  <p className="text-sm text-danger">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-text-primary"
                  htmlFor="lastname"
                >
                  Apellido
                </label>
                <InputSignUp
                  id="lastname"
                  type="text"
                  placeholder="Apellido completo"
                  {...register("lastname", {
                    required: "El apellido es obligatorio",
                    minLength: {
                      value: 3,
                      message: "Debe tener al menos 3 caracteres",
                    },
                  })}
                />
                {errors.lastname && (
                  <p className="text-sm text-danger">
                    {errors.lastname.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-text-primary"
                  htmlFor="role"
                >
                  Rol
                </label>
                <InputOptions
                  id="role"
                  options={[
                    { value: "PATIENT", label: "Paciente" },
                    { value: "CAREGIVER", label: "Cuidador" },
                  ]}
                  {...register("role", {
                    required: "El rol es obligatorio",
                  })}
                />
                {errors.role && (
                  <p className="text-sm text-danger">{errors.role.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-primary px-4 py-3 text-white font-medium transition hover:bg-primary-hover disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Ingresando..." : "Crear Cuenta"}
              </button>

              <button
                onClick={() => setMode(!Mode)}
                className="w-full rounded-2xl bg-primary px-4 py-3 text-white font-medium transition hover:bg-primary-hover disabled:opacity-70"
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
