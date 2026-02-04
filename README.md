# S02-26-Equipo-29-Web-App-Development

# MVP – Plataforma de Gestión de Acompañantes/Cuidadores y Pacientes

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
</p>

## 📌 Descripción del Proyecto

Este proyecto consiste en el desarrollo de un **MVP (Minimum Viable Product)** para una plataforma web/móvil destinada a la gestión de acompañantes/cuidadores y pacientes.

Actualmente, la operación se gestiona mediante planillas Excel y grupos de WhatsApp, lo que genera:
- Información dispersa
- Baja trazabilidad
- Dificultad para controlar horas trabajadas
- Problemas en la consolidación de informes y liquidaciones

La plataforma permitirá centralizar y digitalizar estos procesos, optimizando la gestión operativa y administrativa.

---

## 🎯 Objetivos

### Objetivo General
Desarrollar una plataforma centralizada para gestionar pacientes, cuidadores, guardias, horas e informes, automatizando la liquidación mensual.

### Objetivos Específicos
- Digitalizar el alta y validación documental de cuidadores
- Permitir la carga de horas e informes por guardia
- Centralizar información por paciente
- Mejorar trazabilidad y auditoría
- Reducir tiempos administrativos en liquidaciones

---

## 📦 Alcance del MVP

### ✅ Incluye (In Scope)
- Registro y autenticación de usuarios
- Roles y permisos (Admin / Cuidador / Familia)
- ABM de pacientes
- ABM de cuidadores y documentación
- Asignaciones cuidador ↔ paciente
- Registro de guardias (horas + informes)
- Aprobación administrativa de guardias
- Reportes básicos por período, cuidador y paciente

### ❌ Fuera del alcance del MVP (Out of Scope)
- Historia clínica
- Integraciones con obras sociales/prepagas
- Geolocalización en tiempo real
- Firma digital avanzada
- Chat interno
- Automatización de pagos
- Métricas avanzadas / BI

---

## 👥 Roles del Sistema

- **Admin**
  - Gestiona usuarios, pacientes y cuidadores
  - Valida documentación
  - Aprueba guardias
  - Genera liquidaciones y reportes

- **Cuidador/Acompañante**
  - Se registra y carga documentación
  - Registra guardias e informes

- **Familia**
  - Visualiza información del paciente (modo lectura)

---

## ⚙️ Requerimientos Funcionales

### RF-01 Registro y acceso
- Registro por email/teléfono
- Recuperación de contraseña
- Verificación básica (OTP/email)

### RF-02 Onboarding de cuidadores
- Carga de datos personales y documentación
- Estados: `Pendiente`, `Aprobado`, `Rechazado`, `Suspendido`

### RF-03 Gestión de pacientes
- Alta, edición y baja lógica
- Estados: `Activo`, `Inactivo`

### RF-04 Asignaciones cuidador–paciente
- Rango de fechas
- Tipo de guardia
- Tarifa por hora (opcional)

### RF-05 Registro de guardias
- Horario inicio/fin
- Total de horas
- Informe con adjuntos opcionales
- Estados: `Cargada`, `Pendiente`, `Aprobada`, `Rechazada`

### RF-06 Aprobación administrativa
- Aprobación/recha
