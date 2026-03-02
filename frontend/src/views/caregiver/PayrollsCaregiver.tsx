import { useMemo, useState } from "react";
import { usePayrolls, useUser } from "../../hooks";
import type { Payroll } from "../../types";
import { translateStatus } from "../../utils/status";

export function PayrollsCaregiver() {
	const { data: user } = useUser();
	const [pageSize, setPageSize] = useState(5);
	const [currentPage, setCurrentPage] = useState(1);

	const { data, isLoading } = usePayrolls(1, 100);

	const myPayrolls = useMemo(() => {
		const allPayrolls = data?.payrolls || [];
		const profileId = user?.profile?.id || user?.profile_id || user?.id;

		if (!profileId) return [];

		return allPayrolls.filter(
			(payroll: Payroll) => payroll.profile_id === profileId,
		);
	}, [data?.payrolls, user]);

	const totalPages = Math.max(1, Math.ceil(myPayrolls.length / pageSize));
	const paginatedPayrolls = myPayrolls.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize,
	);

	const totalReceived = myPayrolls
		.filter(
			(payroll) =>
				String(payroll.status).trim().toUpperCase() === "PAID" ||
				String(payroll.status).trim().toUpperCase() === "LIQUIDATED",
		)
		.reduce((acc, payroll) => acc + Number(payroll.totalAmount || 0), 0);

	const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setPageSize(Number(event.target.value));
		setCurrentPage(1);
	};

	const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
	const handleNextPage = () =>
		setCurrentPage((prev) => Math.min(prev + 1, totalPages));

	if (isLoading) {
		return (
			<div className="p-10 flex flex-col items-center justify-center gap-4 text-text-secondary min-h-100">
				<div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
				<p className="font-medium">Cargando historial de pagos...</p>
			</div>
		);
	}

    console.log("Mis Payrolls:", myPayrolls);
    console.log("Paginated Payrolls:", paginatedPayrolls);
    console.log("Total recibido calculado:", totalReceived);
    console.log("Usuario actual:", user);

	return (
		<section className="m-10 rounded-3xl border border-border bg-surface p-6 shadow-lg">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
						Mis pagos
					</p>
					<h2 className="text-xl font-semibold">
						{myPayrolls.length} pagos registrados
					</h2>
					<p className="mt-1 text-sm text-text-secondary">
						Total recibido: <span className="font-semibold text-text-primary">${totalReceived.toLocaleString()}</span>
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					<label className="text-xs font-medium text-text-secondary">
						Resultados por página
					</label>
					<select
						value={pageSize}
						onChange={handlePageSizeChange}
						className="rounded-2xl border border-border bg-white px-3 py-2 text-sm text-text-primary"
					>
						{[5, 10, 15].map((size) => (
							<option key={size} value={size}>
								{size}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="mt-6 overflow-hidden rounded-2xl border border-border">
				<table className="min-w-full divide-y divide-border text-sm">
					<thead className="bg-background text-left text-text-secondary">
						<tr>
							<th className="px-4 py-3 font-medium">Estado</th>
							<th className="px-4 py-3 font-medium">Horas</th>
							<th className="px-4 py-3 font-medium">Monto</th>
							<th className="px-4 py-3 font-medium">CBU / Alias</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border bg-surface">
						{paginatedPayrolls.length > 0 ? (
							paginatedPayrolls.map((payroll) => (
								<tr key={`${payroll.profile_id}-${payroll.status}-${payroll.totalAmount}`} className="hover:bg-white/5">
									<td className="px-4 py-4 text-text-secondary">
										{translateStatus(payroll.status)}
									</td>
									<td className="px-4 py-4 text-text-secondary">
										{Number(payroll.totalHours).toFixed(1)}
									</td>
									<td className="px-4 py-4 font-semibold text-text-primary">
										${Number(payroll.totalAmount).toLocaleString()}
									</td>
									<td className="px-4 py-4 text-text-secondary">
										{payroll.cbu || payroll.mercado_pago_alias || "Sin datos"}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={4} className="px-4 py-8 text-center text-text-secondary">
									No hay pagos disponibles para este cuidador.
								</td>
							</tr>
						)}
					</tbody>
				</table>

				<div className="flex flex-col gap-3 border-t border-border px-4 py-4 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between">
					<p>
						Mostrando {paginatedPayrolls.length} de {myPayrolls.length} pagos
					</p>
					<div className="flex items-center gap-3">
						<button
							onClick={handlePrevPage}
							disabled={currentPage === 1}
							className="rounded-2xl border border-border px-3 py-1 text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
						>
							Anterior
						</button>
						<span className="text-text-primary">
							Página {currentPage} de {totalPages}
						</span>
						<button
							onClick={handleNextPage}
							disabled={currentPage === totalPages}
							className="rounded-2xl border border-border px-3 py-1 text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
						>
							Siguiente
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
