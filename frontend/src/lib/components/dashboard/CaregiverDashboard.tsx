// import { useState, useEffect } from "react";
// import { Sidebar } from "../sidebar/Sidebar";
// // import { PanelCaregiver } from "../../views/caregiver/PanelCaregiver";
// import axios from "axios";
// import type { User } from "../../types";
// import { Outlet } from "react-router-dom";
// import { PanelCaregiver } from "../../views/caregiver/PanelCaregiver";

// export const CaregiverDashboard = () => {

// const [user, setUser] = useState<User | null>(null);

// const userToken = localStorage.getItem("userToken") ? JSON.parse(localStorage.getItem("userToken") as string) : null;

//   console.log("User token en MainDashboard:", userToken.access_token);

//   const getUserData = async () => {
//     if (userToken) {
//       try {
//         const response = await axios.get("http://localhost:3002/auth/me", {
//           headers: {
//             Authorization: `Bearer ${userToken.access_token}`,
//           },
//         });
//         console.log("User data fetched successfully:", response.data);
//         return response.data;
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         return null;
//       }
//     }
//     return null;
//   };

//     useEffect(() => {
//       const fetchProfData = async () => {
//         const userData = await getUserData();
//         setUser(userData);
//       }
//       fetchProfData();
//     }, []);

//     console.log("User en MainDashboard:", user);
//   return (
//     <div className="flex">
//       <Sidebar />
//       <main className="flex-1">
//         <Outlet context={{ user }} />  {/* Aquí se montará Agenda, PanelAdmin, etc. */}
//       </main>
//     </div>
//   );
// };

// export const CaregiverDashboard = () => {
  
//   const [user, setUser] = useState<User | null>(null);

//   const [userRole, setUserRole] = useState<"ADMIN" | "CAREGIVER" | "FAMILY">("FAMILY")

//   // const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
//   const userToken = localStorage.getItem("userToken") ? JSON.parse(localStorage.getItem("userToken") as string) : null;

//   console.log("User token en MainDashboard:", userToken.access_token);

//   const getUserData = async () => {
//     if (userToken) {
//       try {
//         const response = await axios.get("http://localhost:3002/auth/me", {
//           headers: {
//             Authorization: `Bearer ${userToken.access_token}`,
//           },
//         });
//         console.log("User data fetched successfully:", response.data);
//         return response.data;
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         return null;
//       }
//     }
//     return null;
//   };

//     useEffect(() => {
//       const fetchProfData = async () => {
//         const userData = await getUserData();
//         setUser(userData);
//         setUserRole(userData ? userData.role : "FAMILY");
//       }
//       fetchProfData();
//     }, []);


//   return (
//     <div className="flex">
//       <Sidebar />
//       <main className="flex-1">
//         <Outlet context={{ user, userRole }} />  {/* Aquí se montará Agenda, PanelAdmin, etc. */}
//       </main>
//     </div>
//   );
// };

// export const AdminDashboard = () => {
//   const caregivers = [
//     {
//       id: "C-01",
//       name: "María López",
//       shiftRange: "06:00 - 14:00",
//       patients: [
//         {
//           id: "P-102",
//           name: "Don José Pérez",
//           day: "Lunes",
//           schedule: "06:00 - 10:00",
//         },
//         {
//           id: "P-143",
//           name: "Sra. Emilia Torres",
//           day: "Martes",
//           schedule: "10:00 - 14:00",
//         },
//       ],
//     },
//     {
//       id: "C-02",
//       name: "Juan Fernández",
//       shiftRange: "14:00 - 22:00",
//       patients: [
//         {
//           id: "P-210",
//           name: "Srta. Lucía Gómez",
//           day: "Miércoles",
//           schedule: "14:00 - 20:00",
//         },
//       ],
//     },
//   ];

//   const handleEditShift = (caregiverId: string, patientId: string) => {
//     console.log(
//       `Editar turno para cuidador ${caregiverId} y paciente ${patientId}`,
//     );
//   };

//   return (
//     <main className="min-h-screen bg-background p-8 text-text-primary w-auto flex-1">
//       <section className="mx-auto max-w-6xl space-y-8">
//         <header className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
//           <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
//             Panel admin
//           </p>
//           <h1 className="mt-3 text-2xl font-semibold">
//             {caregivers.length} cuidadores activos ·{" "}
//             {caregivers.reduce((acc, c) => acc + c.patients.length, 0)}{" "}
//             pacientes asignados
//           </h1>
//           <p className="mt-2 text-sm text-text-secondary">
//             Administra asignaciones y ajusta turnos en tiempo real.
//           </p>
//         </header>

//         <div className="space-y-6">
//           {caregivers.map((caregiver) => (
//             <article
//               key={caregiver.id}
//               className="rounded-3xl border border-border bg-surface p-6 shadow-lg"
//             >
//               <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                 <div>
//                   <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
//                     Cuidador {caregiver.id}
//                   </p>
//                   <h2 className="text-xl font-semibold">{caregiver.name}</h2>
//                   <p className="text-sm text-text-secondary">
//                     Turno base: {caregiver.shiftRange}
//                   </p>
//                 </div>
//                 <span className="rounded-2xl border border-border bg-background px-4 py-2 text-sm">
//                   {caregiver.patients.length} pacientes asignados
//                 </span>
//               </div>

//               <div className="mt-6 overflow-hidden rounded-2xl border border-border w-auto flex-1">
//                 <table className="min-w-full divide-y divide-border text-sm">
//                   <thead className="bg-background text-left text-text-secondary">
//                     <tr>
//                       <th className="px-4 py-3 font-medium">Paciente</th>
//                       <th className="px-4 py-3 font-medium">Día</th>
//                       <th className="px-4 py-3 font-medium">Horario</th>
//                       <th className="px-4 py-3 font-medium">Acciones</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-border bg-surface">
//                     {caregiver.patients.map((patient) => (
//                       <tr key={patient.id} className="hover:bg-white/5">
//                         <td className="px-4 py-4">
//                           <p className="font-medium">{patient.name}</p>
//                           <p className="text-xs text-text-secondary">
//                             ID {patient.id}
//                           </p>
//                         </td>
//                         <td className="px-4 py-4">{patient.day}</td>
//                         <td className="px-4 py-4">{patient.schedule}</td>
//                         <td className="px-4 py-4">
//                           <button
//                             onClick={() =>
//                               handleEditShift(caregiver.id, patient.id)
//                             }
//                             className="rounded-2xl bg-primary px-3 py-2 text-xs font-medium text-white transition hover:bg-primary-hover"
//                           >
//                             Editar shift
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </article>
//           ))}
//         </div>
//       </section>
//     </main>
//   );
// };

// export const FamilyDashboard = () => {
//   const patient = {
//     id: "P-210",
//     name: "Srta. Lucía Gómez",
//     age: 72,
//     condition: "Seguimiento post operatorio",
//     caregiver: {
//       name: "Juan Fernández",
//       shiftRange: "14:00 - 22:00",
//       phone: "+54 11 5555-9988",
//     },
//     nextVisits: [
//       {
//         day: "Miércoles",
//         schedule: "14:00 - 20:00",
//         focus: "Control de movilidad",
//       },
//       {
//         day: "Viernes",
//         schedule: "16:00 - 20:00",
//         focus: "Supervisión medicación",
//       },
//     ],
//   };

//   return (
//     <main className="min-h-screen bg-background p-8 text-text-primary w-auto flex-1">
//       <section className="mx-auto max-w-4xl space-y-8">
//         <header className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
//           <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
//             Panel familia
//           </p>
//           <h1 className="mt-3 text-2xl font-semibold">{patient.name}</h1>
//           <p className="text-sm text-text-secondary">
//             ID {patient.id} · {patient.age} años · {patient.condition}
//           </p>
//         </header>

//         <section className="grid gap-6 lg:grid-cols-2">
//           <article className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
//             <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
//               Cuidador asignado
//             </p>
//             <h2 className="mt-3 text-xl font-semibold">
//               {patient.caregiver.name}
//             </h2>
//             <p className="text-sm text-text-secondary">
//               Turno: {patient.caregiver.shiftRange}
//             </p>
//             <p className="mt-4 text-sm">
//               Teléfono de contacto:{" "}
//               <span className="font-medium text-primary">
//                 {patient.caregiver.phone}
//               </span>
//             </p>
//           </article>

//           <article className="rounded-3xl border border-border bg-surface p-6 shadow-lg w-auto flex-1">
//             <p className="text-xs uppercase tracking-[0.4em] text-text-secondary">
//               Próximas visitas
//             </p>
//             <ul className="mt-4 space-y-4 text-sm">
//               {patient.nextVisits.map((visit) => (
//                 <li
//                   key={`${visit.day}-${visit.schedule}`}
//                   className="rounded-2xl border border-border bg-background px-4 py-3"
//                 >
//                   <p className="text-base font-semibold">{visit.day}</p>
//                   <p className="text-text-secondary">
//                     {visit.schedule}
//                   </p>
//                   <p className="mt-1">{visit.focus}</p>
//                 </li>
//               ))}
//             </ul>
//           </article>
//         </section>
//       </section>
//     </main>
//   );
// };
