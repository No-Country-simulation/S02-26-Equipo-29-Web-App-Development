import { useCaregivers } from "../../hooks";
import { formatDate } from "../../utils/formatDate";
import { getStatusColor, translateStatus } from "../../utils/status";
import {
  AdminHeaderSkeleton,
  AdminTableSkeleton,
} from "../../components/UI/Skeleton";
import { takeFirstLetters } from "../../utils/firstLetters";

export function Caregivers() {
  const { data: caregivers, isLoading } = useCaregivers();

  if (isLoading) {
    return (
      <div className="p-5 bg-background space-y-6">
        <AdminHeaderSkeleton
          titleWidth="w-80"
          subtitleWidth="w-96"
        />
        <AdminTableSkeleton columns={4} rows={6} />
      </div>
    );
  }

  return (
    <div className="p-5 bg-background space-y-6">
      <header className="rounded-3xl border border-border bg-surface p-8 shadow-xl relative overflow-hidden group">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
          Administrar Cuidadores
        </h1>
        <p className="text-text-secondary mt-2 max-w-2xl">
          Gestionar los aplicantes registrados en el sistema
        </p>
      </header>

      <section className="space-y-4">
        <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-inner">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-background/50 text-left text-text-secondary uppercase tracking-widest text-[10px] font-bold whitespace-nowrap">
                <tr>
                  <th className="px-6 py-4 text-center">Cuidador</th>
                  <th className="px-6 py-4 text-center">Fecha de Registro</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-6 py-4 text-center">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border whitespace-nowrap">
                {caregivers?.map((caregiver) => (
                  <tr
                    key={caregiver.id}
                    className="hover:bg-primary/5 transition-all group"
                  >
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center gap-4 justify-center">
                        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary to-primary/40 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-primary/10 group-hover:scale-105 transition-transform">
                          {takeFirstLetters(caregiver.full_name)}
                        </div>
                        <div className="flex flex-col">
                          <p className="font-bold text-base group-hover:text-primary transition-colors italic">
                            {caregiver.full_name}
                          </p>
                          <p className="text-[10px] font-mono tracking-tighter opacity-50">
                            {caregiver.profile_id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center text-text-secondary font-medium">
                      {formatDate(caregiver.created_at || "")}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(
                          caregiver.status || "",
                        )}`}
                      >
                        {translateStatus(caregiver.status || "")}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button className="bg-surface hover:bg-primary hover:text-white border-2 border-border hover:border-primary rounded-2xl px-6 py-2 text-xs font-black uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] active:scale-90 shadow-sm cursor-pointer whitespace-nowrap">
                        Revisar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
