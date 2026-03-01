import { usePatients } from "../../hooks";
import { formatDate } from "../../utils/formatDate";
import { getStatusColor, translateStatus } from "../../utils/status";

export function Patients() {
  const { data: patients, isLoading } = usePatients();

  if (isLoading) {
    return <div className="p-5">Cargando pacientes...</div>;
  }

  return (
    <div className="p-5 bg-background">
       <header className="rounded-3xl border border-border bg-surface p-8 shadow-xl relative overflow-hidden group">

        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
         Administrar Pacientes
        </h1>
        <p className="text-text-secondary mt-2 max-w-2xl">
          Gestionar los pacientes registrados en el sistema
        </p>
      </header>

      <section>
        <div className="mt-6 overflow-hidden rounded-2xl border border-border w-auto flex-1 col-span-3 md:col-span-3 lg:col-span-2 overflow-x-scroll ">
          <table className="min-w-full divide-y divide-border text-sm ">
            <thead className="bg-background text-left text-text-secondary whitespace-nowrap">
              <tr>
                <th className="px-4 py-3 font-medium">Paciente</th>
                <th className="px-4 py-3 font-medium">Credenciales</th>
                <th className="px-4 py-3 font-medium">Fecha de Registro</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface whitespace-nowrap">
              {patients?.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-background hover:cursor-pointer"
                >
                  <td className="px-4 py-4 flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1559839734-2b71f1e3c770?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <p className="font-medium">{patient.profile?.full_name || "N/A"}</p>
                      <p className="text-xs text-text-secondary">
                        {patient.profile?.id || "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">{patient.profile?.phone || "N/A"}</td>
                  <td className="px-4 py-4">{formatDate(patient.profile?.created_at || "")}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 rounded-full ${getStatusColor(
                        patient.status || "",
                      )}`}
                    >
                      {translateStatus(patient.status || "")}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button className="cursor-pointer hover:bg-primary/80 hover:text-white rounded-2xl border border-border bg-background px-4 py-2 text-sm flex items-center gap-2">
                      Revisar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
