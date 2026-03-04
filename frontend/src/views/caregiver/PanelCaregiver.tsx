
import { useCaregiverShifts } from "../../hooks/caregiver/useCaregiver";
import type { User } from "../../types";
import { Overview } from "./Overview";
import { Header } from "../../components/UI/Headers";



export const PanelCaregiver = ({user}: {user: User}) => {
  const { data: hookShifts, isLoading } = useCaregiverShifts();
  
  return (
    <main className="min-h-screen flex-1 bg-background text-text-primary">
      <section className="mx-auto w-full max-w-5xl space-y-4">

        <Header user={user} shifts={hookShifts?.data} />

        <Overview shiftDays={hookShifts?.data} isLoading={isLoading} />
      </section>
      
    </main>
  );
};