import { useEffect, useState } from "react";
import type { User } from "../../types";
import { api } from "../../lib/axios/api";
import { Agenda } from "./AgendaCaregiver";
import { CaregiverInfo } from "./CaregiverInfo";

export const PanelCaregiver = ({user}: {user: User}) => {
  const [, setUserAuth] = useState<User | null>(null);
  const caregiver = {
    full_name: user ? user.full_name : "Cuidador Desconocido",
    name: user ? user.full_name : "Cuidador Desconocido",
    role: user ? user.role : "Rol desconocido",
    email: user ? user.email : "Desconocido",
    shiftRange: "06:00 - 14:00",
  };

  // const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
  const userToken = localStorage.getItem("userToken") ? JSON.parse(localStorage.getItem("userToken") as string) : null;


  const getUserData = async () => {
    if (userToken) {
      try {
        const response = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${userToken.access_token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
      }
    }
    return null;
  };

    useEffect(() => {
      const fetchProfData = async () => {
        const userData = await getUserData();
        setUserAuth(userData);}
      fetchProfData();
    }, []);


  return (
    <main className="min-h-screen bg-background p-8 text-text-primary w-auto flex-1">
      <section className="mx-auto max-w-5xl space-y-8">
        <header className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
          <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
            Panel cuidador
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{caregiver.name}</h1>
              <p className="text-sm text-text-secondary">
                {caregiver.role}
              </p>
            </div>
            <div className="rounded-2xl bg-primary/10 px-5 py-3 text-sm text-primary">
              Turno asignado: {caregiver.shiftRange}
            </div>
          </div>
          <p className="mt-2 text-sm text-text-secondary">
            {caregiver.email}
          </p>
        </header>

        <Agenda />
        
        <section className="mx-auto max-w-5xl space-y-8 mt-8">
            <CaregiverInfo />
        </section>

        
      </section>
      
    </main>
  );
};