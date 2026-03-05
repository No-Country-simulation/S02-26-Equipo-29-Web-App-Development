import { useState } from "react";
import { FileText, Download, Users, CalendarCheck, DollarSign } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Header } from "../../components/UI/Headers";
import { useReport } from "../../hooks/admin/useReport";

const formatDate = (iso?: string | null) => {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatHour = (iso?: string | null) => {
  if (!iso) return "-";
  return new Date(iso).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
};

const translateStatus = (s?: string) => {
  const map: Record<string, string> = {
    PENDING: "Pendiente",
    ASSIGNED: "Asignado",
    IN_PROGRESS: "En curso",
    COMPLETED: "Completado",
    CANCELLED: "Cancelado",
    REJECTED: "Rechazado",
    pending: "Pendiente",
    payed: "Pagado",
  };
  return s ? (map[s] ?? s) : "-";
};

const translateRole = (r?: string) => {
  const map: Record<string, string> = { PATIENT: "Paciente", CAREGIVER: "Cuidador", ADMIN: "Admin" };
  return r ? (map[r] ?? r) : "-";
};

export function Reports() {
  const today = new Date().toISOString().slice(0, 10);
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .slice(0, 10);

  const [from, setFrom] = useState(firstOfMonth);
  const [to, setTo] = useState(today);
  const [applied, setApplied] = useState({ from: firstOfMonth, to: today });

  const { shifts, payrolls, newUsers, isLoading } = useReport(
    new Date(applied.from).toISOString(),
    new Date(applied.to + "T23:59:59").toISOString(),
  );
  

  const totalHours = shifts.reduce(
    (acc, s) => acc + parseFloat(String(s.hours || "0")),
    0,
  );
  const completedShifts = shifts.filter((s) => s.status === "COMPLETED").length;
  const totalPayrollAmount = payrolls.reduce(
    (acc, p) => acc + parseFloat(String(p.totalAmount || "0")),
    0,
  );

  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const labelFrom = formatDate(applied.from);
    const labelTo = formatDate(applied.to);

    // ── Header ──────────────────────────────────────────────────────────────
    doc.setFontSize(20);
    doc.setTextColor(40, 97, 215);
    doc.text("CUIDAPP", pageWidth / 2, 18, { align: "center" });
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(`Reporte del ${labelFrom} al ${labelTo}`, pageWidth / 2, 25, { align: "center" });
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 28, pageWidth - 14, 28);

    // ── Summary cards ────────────────────────────────────────────────────────
    doc.setFontSize(13);
    doc.setTextColor(30, 30, 30);
    doc.text("Resumen", 14, 36);
 
    const summaryData = [
      ["Turnos totales", String(shifts.length)],
      ["Completados", String(completedShifts)],
      ["Horas totales", `${totalHours.toFixed(1)} hs`],
      ["Total liquidaciones", `$${totalPayrollAmount.toLocaleString("es-AR")}`],
      ["Usuarios nuevos", String(newUsers.length)],
    ];
    autoTable(doc, {
      startY: 40,
      head: [["Métrica", "Valor"]],
      body: summaryData,
      theme: "striped",
      headStyles: { fillColor: [40, 97, 215] },
      margin: { left: 14, right: 14 },
    });

    // ── Agenda ───────────────────────────────────────────────────────────────
    const afterSummary = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(13);
    doc.text("Agenda", 14, afterSummary);

    autoTable(doc, {
      startY: afterSummary + 4,
      head: [["Fecha", "Inicio", "Fin", "Cuidador", "Paciente", "Estado", "Hs", "★"]],
      body: shifts.map((s) => [
        formatDate(s.start_time),
        formatHour(s.start_time),
        formatHour(s.end_time),
        s.caregiver?.profile?.full_name ?? "-",
        s.patient?.profile?.full_name ?? "-",
        translateStatus(s.status),
        s.hours ? parseFloat(String(s.hours)).toFixed(1) : "-",
        s.rating?.number?.toString() ?? "-",
      ]),
      theme: "striped",
      headStyles: { fillColor: [40, 97, 215] },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 8 },
    });

    // ── Liquidaciones ─────────────────────────────────────────────────────────
    const afterAgenda = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(13);
    doc.text("Liquidaciones", 14, afterAgenda);

    autoTable(doc, {
      startY: afterAgenda + 4,
      head: [["Cuidador", "Horas", "Monto", "Estado", "Fecha pago"]],
      body: payrolls.map((p) => [
        p.full_name ?? "-",
        parseFloat(p.totalHours || "0").toFixed(1),
        `$${parseFloat(p.totalAmount || "0").toLocaleString("es-AR")}`,
        translateStatus(p.status),
        formatDate(p.paid_at),
      ]),
      theme: "striped",
      headStyles: { fillColor: [40, 97, 215] },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 9 },
    });

    // ── Usuarios nuevos ───────────────────────────────────────────────────────
    const afterPayrolls = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(13);
    doc.text("Usuarios nuevos", 14, afterPayrolls);

    autoTable(doc, {
      startY: afterPayrolls + 4,
      head: [["Nombre", "Rol", "Fecha de registro"]],
      body: newUsers.map((u) => [
        u.full_name ?? "-",
        translateRole(u.role),
        formatDate(u.created_at),
      ]),
      theme: "striped",
      headStyles: { fillColor: [40, 97, 215] },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 9 },
    });

    doc.save(`reporte_cuidapp_${applied.from}_${applied.to}.pdf`);
  };

  return (
    <main className="min-h-screen flex-1 bg-background text-text-primary">
      <section className="mx-auto w-full max-w-6xl space-y-6 px-4 pb-10">
        <Header title="Reportes" description="Generá reportes por rango de fechas y exportá en PDF" />

        {/* Filter bar */}
        <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-border bg-surface p-4 shadow">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text-secondary">Desde</label>
            <input
              type="date"
              value={from}
              max={to}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text-secondary">Hasta</label>
            <input
              type="date"
              value={to}
              min={from}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
            />
          </div>
          <button
            onClick={() => setApplied({ from, to })}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Aplicar
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isLoading || (shifts.length === 0 && payrolls.length === 0 && newUsers.length === 0)}
            className="ml-auto flex items-center gap-2 rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={16} />
            Exportar PDF
          </button>
        </div>

        {isLoading && (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
          </div>
        )}

        {!isLoading && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {[
                { label: "Turnos", value: shifts.length, icon: <CalendarCheck size={18} />, color: "text-blue-500 bg-blue-500/10" },
                { label: "Completados", value: completedShifts, icon: <CalendarCheck size={18} />, color: "text-green-500 bg-green-500/10" },
                { label: "Horas", value: `${totalHours.toFixed(1)} hs`, icon: <FileText size={18} />, color: "text-orange-500 bg-orange-500/10" },
                { label: "Liquidaciones", value: `$${totalPayrollAmount.toLocaleString("es-AR")}`, icon: <DollarSign size={18} />, color: "text-purple-500 bg-purple-500/10" },
                { label: "Usuarios nuevos", value: newUsers.length, icon: <Users size={18} />, color: "text-cyan-500 bg-cyan-500/10" },
              ].map((card) => (
                <div key={card.label} className="rounded-2xl border border-border bg-surface p-4 shadow">
                  <div className={`mb-2 inline-flex rounded-xl p-2 ${card.color}`}>{card.icon}</div>
                  <p className="text-2xl font-bold text-text-primary">{card.value}</p>
                  <p className="text-xs text-text-secondary">{card.label}</p>
                </div>
              ))}
            </div>

            {/* Agenda table */}
            <div className="rounded-2xl border border-border bg-surface shadow">
              <div className="flex items-center gap-2 border-b border-border px-5 py-3">
                <CalendarCheck size={16} className="text-primary" />
                <h2 className="font-semibold text-text-primary">Agenda ({shifts.length} turnos)</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-background text-left text-xs uppercase tracking-wider text-text-secondary">
                    <tr>
                      <th className="px-4 py-3">Fecha</th>
                      <th className="px-4 py-3">Horario</th>
                      <th className="px-4 py-3">Cuidador</th>
                      <th className="px-4 py-3">Paciente</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Hs</th>
                      <th className="px-4 py-3">★</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {shifts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-text-secondary">
                          Sin turnos en este período
                        </td>
                      </tr>
                    ) : (
                      shifts.map((s) => (
                        <tr key={s.id} className="hover:bg-white/5">
                          <td className="px-4 py-3">{formatDate(s.start_time)}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{formatHour(s.start_time)} – {formatHour(s.end_time)}</td>
                          <td className="px-4 py-3">{s.caregiver?.profile?.full_name ?? "-"}</td>
                          <td className="px-4 py-3">{s.patient?.profile?.full_name ?? "-"}</td>
                          <td className="px-4 py-3">{translateStatus(s.status)}</td>
                          <td className="px-4 py-3">{s.hours ? parseFloat(String(s.hours)).toFixed(1) : "-"}</td>
                          <td className="px-4 py-3">{s.rating?.number ?? "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payrolls table */}
            <div className="rounded-2xl border border-border bg-surface shadow">
              <div className="flex items-center gap-2 border-b border-border px-5 py-3">
                <DollarSign size={16} className="text-primary" />
                <h2 className="font-semibold text-text-primary">Liquidaciones ({payrolls.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-background text-left text-xs uppercase tracking-wider text-text-secondary">
                    <tr>
                      <th className="px-4 py-3">Cuidador</th>
                      <th className="px-4 py-3">Horas</th>
                      <th className="px-4 py-3">Monto</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Fecha pago</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {payrolls.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-text-secondary">
                          Sin liquidaciones en este período
                        </td>
                      </tr>
                    ) : (
                      payrolls.map((p, i) => (
                        <tr key={i} className="hover:bg-white/5">
                          <td className="px-4 py-3">{p.full_name ?? "-"}</td>
                          <td className="px-4 py-3">{parseFloat(p.totalHours || "0").toFixed(1)} hs</td>
                          <td className="px-4 py-3 font-medium">${parseFloat(p.totalAmount || "0").toLocaleString("es-AR")}</td>
                          <td className="px-4 py-3">{translateStatus(p.status)}</td>
                          <td className="px-4 py-3">{formatDate(p.paid_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* New users table */}
            <div className="rounded-2xl border border-border bg-surface shadow">
              <div className="flex items-center gap-2 border-b border-border px-5 py-3">
                <Users size={16} className="text-primary" />
                <h2 className="font-semibold text-text-primary">Usuarios nuevos ({newUsers.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-background text-left text-xs uppercase tracking-wider text-text-secondary">
                    <tr>
                      <th className="px-4 py-3">Nombre</th>
                      <th className="px-4 py-3">Rol</th>
                      <th className="px-4 py-3">Fecha de registro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {newUsers.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-center text-text-secondary">
                          Sin usuarios nuevos en este período
                        </td>
                      </tr>
                    ) : (
                      newUsers.map((u, i) => (
                        <tr key={i} className="hover:bg-white/5">
                          <td className="px-4 py-3">{u.full_name ?? "-"}</td>
                          <td className="px-4 py-3">{translateRole(u.role)}</td>
                          <td className="px-4 py-3">{formatDate(u.created_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
