import { useState } from "react";
import { usePayrollsByCaregiver, useUser } from "../../hooks";
import { useCaregiverShifts } from '../../hooks/caregiver/useCaregiver';
import { translateStatus } from "../../utils/status";
import { ReceiptModal } from "../../components";
import { Header } from "../../components/UI/Headers";

export function PayrollsCaregiver() {
  const { data: user } = useUser();
  const { data: shifts } = useCaregiverShifts();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("pending");
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const limit = 10;

  const caregiverId = user?.profile?.id || user?.profile_id || user?.id;

  const { data, isLoading } = usePayrollsByCaregiver(
    caregiverId,
    page,
    limit,
    activeTab,
  );

  const handleViewReceipt = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setShowReceipt(true);
  };

  if (isLoading) {
    return (
      <>
        <Header user={user} shifts={shifts} />

        <section className="mt-6 rounded-3xl border border-border bg-surface p-6 shadow-lg animate-pulse">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="h-3 w-24 rounded-xl bg-border" />
              <div className="mt-2 h-7 w-56 rounded-xl bg-border" />
            </div>
            <div className="mt-2 flex gap-2 sm:mt-0">
              <div className="h-9 w-24 rounded-xl bg-border" />
              <div className="h-9 w-24 rounded-xl bg-border" />
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <div className="bg-background px-4 py-3 flex gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 w-20 rounded-xl bg-border" />
              ))}
            </div>

            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-8 px-4 py-4 border-t border-border bg-surface">
                <div className="h-4 w-20 rounded-xl bg-border flex-1" />
                <div className="h-4 w-16 rounded-xl bg-border flex-1" />
                <div className="h-4 w-24 rounded-xl bg-border flex-1" />
                <div className="h-4 w-32 rounded-xl bg-border flex-1" />
              </div>
            ))}

            <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="h-4 w-28 rounded-xl bg-border" />
              <div className="flex items-center gap-3">
                <div className="h-8 w-24 rounded-2xl bg-border" />
                <div className="h-8 w-24 rounded-2xl bg-border" />
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  const payrolls = data?.payrolls || [];
  const meta = data?.meta || { total: 0, page: 1, lastPage: 1 };

  return (
    <>
      <Header user={user} shifts={shifts} />
      
      <section className="mt-6 rounded-3xl border border-border bg-surface p-6 shadow-lg">
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
              <th className="px-4 py-3 font-medium text-right">Acción</th>
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
                  <td className="px-4 py-4 text-right">
                    {payroll.status === "payed" && payroll.payment_id ? (
                      <button
                        onClick={() => handleViewReceipt(payroll.payment_id)}
                        className="text-xs font-bold text-primary hover:underline cursor-pointer"
                      >
                        Ver comprobante
                      </button>
                    ) : (
                      <span className="text-xs text-text-secondary italic opacity-50">
                        {payroll.status === "payed" ? "Procesando..." : "Pendiente"}
                      </span>
                    )}
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

      {showReceipt && selectedPaymentId && (
        <ReceiptModal
          paymentId={selectedPaymentId}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </section>
    </>
  );
}
