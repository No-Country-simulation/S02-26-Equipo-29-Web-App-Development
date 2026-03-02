import { useState } from "react";
import { usePayrolls } from "../../hooks";
import { getStatusColor, translateStatus } from "../../utils/status";
import { takeFirstLetters } from "../../utils/firstLetters";
import { ChevronLeft, ChevronRight, Calculator, Landmark } from "lucide-react";
import type { Payroll } from "../../types";
import { PaymentModal } from "../../components";

export function Payrolls() {
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading } = usePayrolls(page, limit);

  const handleSelectPayroll = (payroll: Payroll) => {
    setSelectedPayroll(payroll);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedPayroll(null);
    setShowModal(false);
  };

  if (isLoading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center gap-4 text-text-secondary min-h-[400px]">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="font-medium animate-pulse">Cargando información de sueldos...</p>
      </div>
    );
  }

  const payrolls = data?.payrolls || [];
  const meta = data?.meta || { total: 0, page: 1, lastPage: 1 };

  return (
    <div className="p-5 bg-background space-y-6">
      <header className="rounded-3xl border border-border bg-surface p-8 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Calculator size={120} />
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
          Administración de Pagos
        </h1>
        <p className="text-text-secondary mt-2 max-w-2xl">
          Visualiza y gestiona las liquidaciones acumuladas de los cuidadores. 
          Controla horas trabajadas y montos pendientes de pago.
        </p>
      </header>

      <section className="space-y-4">
        <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-inner">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-background/50 text-left text-text-secondary uppercase tracking-widest text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-4">Cuidador</th>
                  <th className="px-6 py-4">Horas Totales</th>
                  <th className="px-6 py-4">Monto a Liquidar</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">OPERACIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border whitespace-nowrap">
                {payrolls.length > 0 ? (

                  payrolls.map((payroll: Payroll) => (
                    <tr
                      key={`${payroll.profile_id}-${payroll.status}`}
                      className="hover:bg-primary/5 transition-all group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary to-primary/40 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-primary/10 group-hover:scale-105 transition-transform">
                            {takeFirstLetters(payroll.full_name)}
                          </div>
                          <div className="flex flex-col">
                            <p className="font-bold text-base group-hover:text-primary transition-colors italic">
                              {payroll.full_name}
                            </p>
                            <div className="flex items-center gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
                              <Landmark size={12} className="text-text-secondary" />
                              <p className="text-[10px] font-mono tracking-tighter">
                                {payroll.cbu || payroll.mercado_pago_alias || "DATOS NO DISPONIBLES"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex flex-col items-start">
                          <span className="font-black text-xl text-text-primary tracking-tight">
                            {Number(payroll.totalHours).toFixed(1)}
                          </span>
                          <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest opacity-60">
                            u. horarias
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col items-start">
                          <span className="font-black text-xl text-primary tracking-tight">
                            ${Number(payroll.totalAmount).toLocaleString()}
                          </span>
                          <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest opacity-60 italic">
                            ARS - Bruto
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(
                            payroll.status,
                          )}`}
                        >
                          {translateStatus(payroll.status)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                        onClick={() => handleSelectPayroll(payroll)}
                        className="relative overflow-hidden cursor-pointer bg-surface hover:bg-primary hover:text-white border-2 border-border hover:border-primary rounded-2xl px-8 py-2.5 text-xs font-black uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] active:scale-95 group">
                          <span className="relative z-10 transition-colors">Liquidar</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-text-secondary italic opacity-50">
                      No se encontraron registros de liquidación para este periodo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {meta.lastPage > 1 && (
            <div className="px-6 py-4 bg-background/30 border-t border-border flex items-center justify-between">
              <p className="text-xs text-text-secondary font-medium">
                Mostrando página <span className="text-primary font-bold">{meta.page}</span> de <span className="font-bold">{meta.lastPage}</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl border border-border bg-surface hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(meta.lastPage, p + 1))}
                  disabled={page === meta.lastPage}
                  className="p-2 rounded-xl border border-border bg-surface hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
          {showModal && (
            <PaymentModal
              caregiverName={selectedPayroll?.full_name || ""}
              amount={selectedPayroll?.totalAmount || 0}
              cbu={selectedPayroll?.cbu || "No ingresado"}
              ids={selectedPayroll?.ids || []}
              mercadoPagoAlias={selectedPayroll?.mercado_pago_alias || "No ingresado"}
              onClose={handleCloseModal}
            />
          )}
         
        </div>
      </section>
    </div>
  );
}
