import { useState } from "react";
import { usePayrollsByCaregiver, useUser } from "../../hooks";
import { translateStatus } from "../../utils/status";

export function PayrollsCaregiver() {
  const { data: user } = useUser();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("pending");
  const limit = 10;

  const caregiverId = user?.profile?.id || user?.profile_id || user?.id;

  const { data, isLoading } = usePayrollsByCaregiver(
    caregiverId,
    page,
    limit,
    activeTab,
  );

  if (isLoading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center gap-4 text-text-secondary min-h-100">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="font-medium animate-pulse">
          Cargando historial de pagos...
        </p>
      </div>
    );
  }

  const payrolls = data?.payrolls || [];
  const meta = data?.meta || { total: 0, page: 1, lastPage: 1 };

  return (
    <section className="m-10 rounded-3xl border border-border bg-surface p-6 shadow-lg">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
            Mis pagos
          </p>
          <h2 className="text-xl font-semibold">
            {meta.total} pagos registrados
          </h2>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                setActiveTab("pending");
                setPage(1);
              }}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "pending"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-background text-text-secondary hover:bg-primary/10 hover:text-primary"
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => {
                setActiveTab("payed");
                setPage(1);
              }}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "payed"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-background text-text-secondary hover:bg-primary/10 hover:text-primary"
              }`}
            >
              Pagados
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-background text-left text-text-secondary">
            <tr>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-center">Horas</th>
              <th className="px-4 py-3 font-medium">Monto</th>
              <th className="px-4 py-3 font-medium">CBU / Alias</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {payrolls.length > 0 ? (
              payrolls.map((payroll) => (
                <tr
                  key={`${payroll.profile_id}-${payroll.status}-${
                    payroll.totalAmount
                  }-${Math.random()}`}
                  className="hover:bg-white/5"
                >
                  <td className="px-4 py-4 text-text-secondary">
                    {translateStatus(payroll.status)}
                  </td>
                  <td className="px-4 py-4 text-center text-text-secondary">
                    {Number(payroll.totalHours).toFixed(1)}
                  </td>
                  <td className="px-4 py-4 font-semibold text-text-primary">
                    ${Number(payroll.totalAmount).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-text-secondary italic">
                    {payroll.cbu || payroll.mercado_pago_alias || "Sin datos"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-20 text-center text-text-secondary italic opacity-50"
                >
                  No hay registros disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {meta.lastPage > 1 && (
          <div className="flex flex-col gap-3 border-t border-border px-4 py-4 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between">
            <p>
              Página {meta.page} de {meta.lastPage}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="rounded-2xl border border-border px-4 py-1.5 text-text-primary font-bold hover:bg-background transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, meta.lastPage))
                }
                disabled={page === meta.lastPage}
                className="rounded-2xl border border-border px-4 py-1.5 text-text-primary font-bold hover:bg-background transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
