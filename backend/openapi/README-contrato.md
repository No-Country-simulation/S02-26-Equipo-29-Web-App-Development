# Caregiving PYME API – OpenAPI Contract (MVP)

Este repositorio contiene el **contrato OpenAPI 3.0** de la API para la gestión de una PYME de acompañantes/cuidadores.

El objetivo principal de esta etapa es definir un **MVP liviano y claro**, alineado al diagrama Mermaid *Lean + Documents*, que sirva como **fuente única de verdad** para backend, frontend y documentación.

---

## 🎯 Objetivo del MVP

Digitalizar y ordenar los procesos actuales (hoy manejados con Excel y WhatsApp):

- Gestión de usuarios y perfiles
- Pacientes y vínculos familiares
- Cuidadores y documentación
- Turnos (carga, envío y aprobación)
- Liquidaciones (payrolls)
- Pagos (registro manual en el MVP)
- Subida de documentos vía URLs prefirmadas

👉 **En esta etapa no se implementa lógica de negocio**, solo el contrato de la API.

---

## 🧱 Estructura del OpenAPI

```text
openapi/
├── openapi.yaml
├── paths/
├── schemas/
└── components/
```

---

## 📄 Principios del diseño

- OpenAPI-first
- MVP lean
- Modular y escalable
- Sin seguridad por ahora (`security: []`)

---

## ▶️ Cómo levantar la documentación

```bash
pnpm install
pnpm openapi:check
```

Swagger:
```
http://localhost:3000/docs
```

---

## 🧪 Estado actual

- ✅ OpenAPI válido
- ✅ Swagger UI funcionando
- ⚠️ Sin autenticación (a propósito)

---

## 🤝 Convenciones

- No modificar el root sin avisar
- Mantener nombres consistentes
- Todo endpoint debe tener `operationId`

---

## 🌱 Próximos pasos

- Implementar `/health`
- Controllers NestJS
- JWT
