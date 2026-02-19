// import { useState, useEffect } from 'react';
// import type { Caregiver } from "../../types";


// interface CareSession {
//     id: string;
//     caregiverId: string;
//     caregiverName: string;
//     date: string;
//     startTime: string;
//     endTime: string;
//     notes: string;
// }

// export const PatientDashboard: React.FC = () => {
//     const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
//     const [careSessions, setCareSessions] = useState<CareSession[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // TODO: Fetch data from your API
//         // fetchCaregivers();
//         // fetchCareSessions();
//         setLoading(false);
//     }, []);

//     const groupSessionsByGiver = () => {
//         const grouped: { [key: string]: CareSession[] } = {};
//         careSessions.forEach((session) => {
//             if (!grouped[session.caregiverId]) {
//                 grouped[session.caregiverId] = [];
//             }
//             grouped[session.caregiverId].push(session);
//         });
//         return grouped;
//     };

//     if (loading) {
//         return (
//             <div className="mx-auto w-full max-w-6xl px-4 py-10 text-slate-700">
//                 <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm">
//                     Cargando...
//                 </div>
//             </div>
//         );
//     }

//     const groupedSessions = groupSessionsByGiver();

//     return (
//         <div className="mx-auto w-full max-w-6xl px-4 py-10 text-slate-900 bg-black">
//             <div className="mb-8">
//                 <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Mi Equipo de Cuidado</h1>
//                 <p className="mt-2 text-sm text-slate-600">
//                     Consulta tus cuidadores asignados y las sesiones programadas.
//                 </p>
//             </div>

//             <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//                 {caregivers.map((giver) => (
//                     <div
//                         key={giver.id}
//                         className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white/90 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
//                     >
//                         <div className="border-b border-slate-100 px-5 py-4">
//                             <h2 className="text-lg font-semibold text-slate-900">{giver.name}</h2>
//                         </div>
                        
//                         <div className="flex flex-1 flex-col gap-5 px-5 py-4">
//                             <div className="space-y-2 text-sm text-slate-700">
//                                 <p className="flex items-center gap-2">
//                                     <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Telefono</span>
//                                     <span className="font-medium text-slate-900">{giver.phone}</span>
//                                 </p>
//                                 <p className="flex items-center gap-2">
//                                     <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</span>
//                                     <span className="font-medium text-slate-900">{giver.email}</span>
//                                 </p>
//                             </div>

//                             <div>
//                                 <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Dias de Atencion</h3>
//                                 <div className="mt-3 space-y-3">
//                                 {groupedSessions[giver.id]?.map((session) => (
//                                     <div
//                                         key={session.id}
//                                         className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
//                                     >
//                                         <div className="flex flex-wrap items-center gap-2 text-sm">
//                                             <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
//                                                 {session.date}
//                                             </span>
//                                             <span className="font-medium text-slate-700">
//                                                 {session.startTime} - {session.endTime}
//                                             </span>
//                                         </div>
//                                         {session.notes && (
//                                             <p className="mt-2 text-sm text-slate-600">{session.notes}</p>
//                                         )}
//                                     </div>
//                                 )) || (
//                                     <p className="rounded-lg border border-dashed border-slate-200 px-3 py-2 text-sm text-slate-500">
//                                         Sin sesiones registradas
//                                     </p>
//                                 )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {caregivers.length === 0 && (
//                 <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-white/70 p-8 text-center text-slate-600">
//                     <p className="text-base font-medium">No tienes cuidadores asignados</p>
//                     <p className="mt-2 text-sm text-slate-500">
//                         Cuando tengas un cuidador asignado, aparecera aqui.
//                     </p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PatientDashboard;