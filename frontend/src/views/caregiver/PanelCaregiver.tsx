
import { useCaregiverShifts } from "../../hooks/caregiver/useCaregiver";

import { Overview } from "./Overview";
import { Header } from "../../components/UI/Headers";



export const PanelCaregiver = () => {
  const { data: hookShifts, isLoading } = useCaregiverShifts();

  const shifts = Array.isArray(hookShifts)
    ? hookShifts
    : hookShifts?.data || [];
  
  return (
    <main className="min-h-screen flex-1 bg-background text-text-primary">
      <section className="mx-auto w-full max-w-5xl space-y-4">

        <Header 
          title="Panel del Cuidador" 
          description="Gestión integral de tus servicios y pacientes" 
        />

        <Overview shiftDays={shifts} isLoading={isLoading} />
      </section>
      
    </main>
  );
};