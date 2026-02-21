import { useCaregivers } from "../../hooks";
import { formatDate } from "../../utils/formatDate";
import { getStatusColor } from "../../utils/status";
import { translateStatus } from "../../utils/status";

export function Caregivers() {

 const {data: caregivers, isLoading} = useCaregivers();
  
  if(isLoading){
    return (<div> loading</div>)
  }
  return (
    <div className="p-5 bg-background">
      <header className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
        <h1 className="text-2xl font-bold ">Administrar Cuidadores</h1>
        <p className="text-gray-400">
          Gestionar los aplicantes registrados en el sistema
        </p>
      </header>

      <section>
        <div className="mt-6 overflow-hidden rounded-2xl border border-border w-auto flex-1 col-span-3 md:col-span-3 lg:col-span-2 overflow-x-scroll ">
          <table className="min-w-full divide-y divide-border text-sm ">
            <thead className="bg-background text-left text-text-secondary whitespace-nowrap">
              <tr>
                <th className="px-4 py-3 font-medium">Cuidador</th>
                <th className="px-4 py-3 font-medium">Credenciales</th>
                <th className="px-4 py-3 font-medium">Fecha de Registro</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Notas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface whitespace-nowrap">
              {caregivers.map((caregiver, index) => (
                <tr
                  key={index}
                  className="hover:bg-background hover:cursor-pointer"
                >
                  <td className="px-4 py-4 flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex flex-col">
                      <p className="font-medium">{caregiver.full_name}</p>
                      <p className="text-xs text-text-secondary">
                        {caregiver.profile_id}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">{caregiver.credentials}</td>
                  <td className="px-4 py-4">{formatDate(caregiver.created_at)}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 rounded-full ${getStatusColor(
                        caregiver.status,
                      )}`}
                    >
                      {translateStatus(caregiver.status)}
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
