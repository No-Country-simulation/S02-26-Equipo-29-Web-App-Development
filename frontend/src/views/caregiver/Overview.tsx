import React, { useState } from 'react';

interface ShiftDay {
    id: string;
    start_time?: string;
    startTime?: string;
    end_time?: string;
    endTime?: string;
    status?: string;
}

interface OverviewProps {
    shiftDays?: ShiftDay[];
    isLoading?: boolean;
}

const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/** Returns Tailwind classes based on the dominant status for a given day */
const getDayStyles = (status: string | undefined): { border: string; bg: string; text: string; badge: string } => {
    switch (status) {
        case 'ASSIGNED':
            return { border: 'border-green-400/60', bg: 'bg-green-400/10', text: 'text-green-600', badge: 'bg-green-500' };
        case 'COMPLETED':
            return { border: 'border-blue-400/60', bg: 'bg-blue-400/10', text: 'text-blue-600', badge: 'bg-blue-500' };
        case 'CANCELLED':
        case 'REJECTED':
            return { border: 'border-red-400/60', bg: 'bg-red-400/10', text: 'text-red-600', badge: 'bg-red-500' };
        case 'IN_PROGRESS':
            return { border: 'border-yellow-400/60', bg: 'bg-yellow-400/10', text: 'text-yellow-600', badge: 'bg-yellow-500' };
        case 'PENDING':
        default:
            return { border: 'border-primary/40', bg: 'bg-primary/10', text: 'text-primary', badge: 'bg-primary' };
    }
};

export const Overview: React.FC<OverviewProps> = ({ shiftDays = [], isLoading = false }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    if (isLoading) {
        return (
            <section className="w-full rounded-3xl border border-border bg-surface p-6 shadow-lg animate-pulse">
                <div className="mb-6 text-center">
                    <div className="mx-auto h-8 w-48 rounded-xl bg-border" />
                    <div className="mx-auto mt-2 h-4 w-40 rounded-xl bg-border" />
                </div>

                <div className="mb-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <div className="h-10 w-28 rounded-2xl bg-border" />
                    <div className="h-7 w-52 rounded-xl bg-border" />
                    <div className="h-10 w-28 rounded-2xl bg-border" />
                </div>

                <div className="mb-6">
                    <div className="mb-3 grid grid-cols-7 gap-2">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div key={i} className="h-9 rounded-xl bg-border" />
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2 sm:gap-3">
                        {Array.from({ length: 35 }).map((_, i) => (
                            <div key={i} className="aspect-square rounded-2xl border border-border bg-background p-2" />
                        ))}
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-border bg-background px-4 py-3">
                    <div className="h-4 w-24 rounded-xl bg-border" />
                    <div className="h-4 w-24 rounded-xl bg-border" />
                </div>
            </section>
        );
    }

    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const normalizedShifts = shiftDays
        .map((shift) => {
            const startValue = shift.start_time || shift.startTime;
            const endValue = shift.end_time || shift.endTime;
            if (!startValue) return null;

            return {
                start: new Date(startValue),
                end: endValue ? new Date(endValue) : null,
                status: shift.status,
            };
        })
        .filter(
            (
                shift,
            ): shift is {
                start: Date;
                end: Date | null;
                status: string | undefined;
            } => Boolean(shift),
        );

    const shiftsForDay = (day: number) => {
        return normalizedShifts.filter(
            (shift) =>
                shift.start.getDate() === day &&
                shift.start.getMonth() === currentDate.getMonth() &&
                shift.start.getFullYear() === currentDate.getFullYear(),
        );
    };

    const formatHour = (date: Date | null) => {
        if (!date) return '--:--';
        return date.toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    const getShiftRangeText = (day: number) => {
        const dayShifts = shiftsForDay(day);
        if (dayShifts.length === 0) return '';

        const firstShift = dayShifts
            .slice()
            .sort((a, b) => a.start.getTime() - b.start.getTime())[0];

        return `${formatHour(firstShift.start)} - ${formatHour(firstShift.end)}`;
    };

    /** Returns the "dominant" status for a day (priority: IN_PROGRESS > ASSIGNED > PENDING > COMPLETED > CANCELLED) */
    const getDayStatus = (day: number): string | undefined => {
        const dayShifts = shiftsForDay(day);
        if (dayShifts.length === 0) return undefined;
        const priority = ['IN_PROGRESS', 'ASSIGNED', 'PENDING', 'COMPLETED', 'CANCELLED', 'REJECTED'];
        for (const p of priority) {
            if (dayShifts.some(s => s.status === p)) return p;
        }
        return dayShifts[0].status;
    };

    const hasShift = (day: number) => {
        return shiftsForDay(day).length > 0;
    };

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const emptyDays = Array.from({ length: firstDayOfMonth(currentDate) });
    const days = Array.from({ length: daysInMonth(currentDate) }, (_, i) => i + 1);

    return (
        <section className="w-full rounded-3xl border border-border bg-surface p-6 shadow-lg">
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-semibold text-text-primary sm:text-3xl">Mis Turnos</h1>
                <p className="mt-1 text-sm text-text-secondary">Calendario de asignaciones</p>
            </div>

            <div className="mb-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <button
                    onClick={previousMonth}
                    className="rounded-2xl border border-border px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-accent/20"
                >
                    ← Anterior
                </button>
                <h2 className="text-lg font-semibold text-text-primary sm:text-xl">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                    onClick={nextMonth}
                    className="rounded-2xl border border-border px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-accent/20"
                >
                    Siguiente →
                </button>
            </div>

            <div className="mb-6">
                <div className="mb-3 grid grid-cols-7 gap-2">
                    {dayNames.map((day: string) => (
                        <div
                            key={day}
                            className="rounded-xl bg-background px-2 py-2 text-center text-xs font-semibold text-text-secondary sm:text-sm"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2 sm:gap-3">
                    {emptyDays.map((_, index: number) => (
                        <div key={`empty-${index}`} className="aspect-square" />
                    ))}

                    {days.map((day: number) => {
                        const isShiftDay = hasShift(day);
                        const status = getDayStatus(day);
                        const styles = getDayStyles(status);

                        return (
                            <div
                                key={day}
                                className={`relative aspect-square rounded-2xl border p-2 text-center transition ${
                                    isShiftDay
                                        ? `${styles.border} ${styles.bg} ${styles.text}`
                                        : 'border-border bg-background text-text-secondary'
                                }`}
                            >
                                <div className="text-sm font-semibold sm:text-base">{day}</div>
                                {isShiftDay && (
                                    <span className={`mt-1 inline-block rounded-full ${styles.badge} px-2 py-0.5 text-[10px] font-semibold text-white sm:text-xs`}>
                                        {getShiftRangeText(day)}
                                        <span className="sr-only"> - Día con turno asignado</span>
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-border bg-background px-4 py-3 text-xs text-text-secondary">
                <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm bg-green-500" />
                    <span>Asignado</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm bg-primary" />
                    <span>Pendiente</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm bg-yellow-500" />
                    <span>En curso</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm bg-blue-500" />
                    <span>Completado</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm bg-red-500" />
                    <span>Cancelado</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm border border-border bg-background" />
                    <span>Sin turno</span>
                </div>
            </div>
        </section>
    );
};