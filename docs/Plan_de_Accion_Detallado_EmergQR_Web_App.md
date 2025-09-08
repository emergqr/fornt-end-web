# 🚀 **Plan de Acción: EmergQR Web App (MVP en 5 días)**  
**Objetivo**: MVP funcional con sección pública informativa + sección privada (perfil + contactos de emergencia), alineado con la app móvil.

---

## ✅ **Pila Tecnológica Confirmada**
*(Marcar como completado si estás de acuerdo)*

- [ ] **Framework**: Next.js (con React)  
- [ ] **UI Library**: MUI o Chakra UI *(elegir uno)*  
- [ ] **Gestión de Estado**: Zustand (consistencia con app móvil)  
- [ ] **Cliente HTTP**: Axios  
- [ ] **Validación de Formularios**: react-hook-form  

> ✅ *Una vez confirmada, proceder con la estructura base.*

---

# 🗓️ **Fase 1: MVP (Días 1-5)**

---

## 📅 **DÍA 1: Estructura Inicial + Parte Pública**

### 🛠️ Setup del Proyecto
- [ ] Crear nuevo proyecto Next.js: `npx create-next-app emergqr-web`
- [ ] Instalar dependencias:
  ```bash
  npm install axios zustand react-hook-form @mui/material @emotion/react @emotion/styled
  # o si usas Chakra UI:
  # npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
  ```
- [ ] Configurar ESLint + Prettier (opcional, pero recomendado)

### 🖼️ Páginas Públicas (Estáticas)
- [ ] Crear `pages/index.tsx` → Página de inicio (landing)
- [ ] Crear `pages/quienes-somos.tsx` → Misión, visión, valores
- [ ] Crear `pages/servicios.tsx` → Descripción de servicios

### 🧱 Layout Público
- [ ] Crear `components/layout/PublicLayout.tsx`
  - [ ] Incluir cabecera con logo + menú de navegación (Inicio, Quiénes Somos, Servicios)
  - [ ] Incluir pie de página (copyright, enlaces básicos)
  - [ ] Botón/Enlace “Iniciar Sesión” en cabecera

> ✅ *Al final del Día 1: La app debe renderizar páginas públicas con navegación funcional.*

---

## 📅 **DÍAS 2-3: Autenticación y Acceso Privado**

### 🔐 Páginas de Autenticación
- [ ] Crear `pages/auth/login.tsx` → Formulario con email + password
- [ ] Crear `pages/auth/registro.tsx` → Formulario con nombre, email, password, confirmación

### ⚙️ Servicio de Autenticación (`services/authService.ts`)
- [ ] Implementar función `login(credentials)` → POST `/api/v1/auth/login`
- [ ] Implementar función `register(userData)` → POST `/api/v1/auth/register`
- [ ] Manejo de errores y mensajes de feedback

### 🧠 Store de Zustand (`stores/auth.store.ts`)
- [ ] Crear store global con:
  - `token: string | null`
  - `user: Client | null`
  - `isAuthenticated: boolean`
  - Acciones: `login`, `logout`, `setUser`, `persistToken`

### 🚧 Rutas Protegidas
- [ ] Crear HOC o middleware de autenticación (`components/auth/ProtectedRoute.tsx`)
  - Redirige a `/auth/login` si no hay token válido
- [ ] Aplicar `ProtectedRoute` a rutas privadas (ej: `/dashboard/*`)

> ✅ *Al final del Día 3: Usuario puede registrarse, iniciar sesión, y acceder a rutas protegidas. Token persiste en Zustand.*

---

## 📅 **DÍAS 4-5: Funcionalidad Central – Perfil + Contactos de Emergencia**

### 👤 Página de Perfil (`pages/dashboard/perfil.tsx`)
- [ ] Layout privado básico (sidebar o navbar simple)
- [ ] Título “Mi Perfil” + datos del usuario

### 🔄 Servicio de Cliente (`services/clientService.ts`)
- [ ] `getProfile()` → GET `/api/v1/clients/me`
- [ ] `updateProfile(data)` → PUT `/api/v1/clients/me`

### 📝 Formulario de Perfil (dentro de `perfil.tsx`)
- [ ] Mostrar y editar: nombre, email, teléfono, fecha de nacimiento
- [ ] Validación con `react-hook-form`
- [ ] Botón “Guardar Cambios” → actualiza perfil vía API

### 🆘 Gestión de Contactos de Emergencia
#### Listado
- [ ] Llamar a `GET /api/v1/contacts/` al cargar la página
- [ ] Mostrar tabla o lista de contactos (nombre, relación, teléfono, estado de visibilidad, acciones)

#### Formulario para Añadir/Editar Contacto
- [ ] Un único formulario (modal o en línea) para crear y editar.
- [ ] Botón "+ Añadir Contacto" para abrir el formulario en modo creación.
- [ ] Botón "Editar" junto a cada contacto para abrir el formulario en modo edición con los datos precargados.
- [ ] Campos del formulario: nombre, relación, teléfono, email (opcional) y un **interruptor (toggle/checkbox) para "Hacer visible en QR público"**.
- [ ] Lógica de envío:
  - Si es nuevo → `POST /api/v1/contacts/`
  - Si es existente → `PUT /api/v1/contacts/{uuid}`

#### Eliminar Contacto
- [ ] Botón “Eliminar” junto a cada contacto.
- [ ] Confirmación antes de `DELETE /api/v1/contacts/{uuid}`.

> ✅ *Al final del Día 5: Usuario puede ver/editar su perfil y gestionar contactos de emergencia (CRUD básico). MVP COMPLETADO.*

---

# 📈 **Fase 2: Extensión Post-MVP (Priorización Futura)**

*(Marcar como “Listo para desarrollo” cuando MVP esté estable y desplegado)*

- [ ] **Historial Médico**: Línea de tiempo con eventos (GET `/api/v1/medical-events/`)
- [ ] **Gestión de Alergias**: CRUD completo (GET/POST/PUT/DELETE `/api/v1/allergies/`)
- [ ] **Gestión de Enfermedades**: CRUD completo (GET/POST/PUT/DELETE `/api/v1/conditions/`)
- [ ] **Signos Vitales**: Formularios + gráficos de evolución (POST `/api/v1/vital-signs/`)
- [ ] **Planes de Medicación**: Gestión de medicamentos + recordatorios (CRUD `/api/v1/medications/`)
- [ ] **Subida de Archivos**: Adjuntar PDFs/Imágenes a eventos médicos (POST `/api/v1/documents/`)

> ✅ *Priorizar según feedback de usuarios o necesidades clínicas más urgentes.*

---

# 🚦 **Próximos Pasos Inmediatos**

1. [ ] **Confirmar pila tecnológica y plan de acción** (✅ checklist arriba)
2. [ ] **Asignar responsable de iniciar estructura base (Día 1)**
3. [ ] **Definir entorno de desarrollo compartido (Git, branches, etc.)**
4. [ ] **Configurar variables de entorno (.env.local) con URL base de API**
5. [ ] **Definir criterios de aceptación para cada tarea (QA básico)**

---

## 📌 Notas Adicionales

- **Despliegue sugerido**: Vercel (integración nativa con Next.js)
- **Testing básico**: Validar flujos principales (registro → login → perfil → editar → logout)
- **Diseño responsive**: Asegurar que funcione en móvil (importante para complementar app móvil)
- **Feedback loop**: Revisión diaria de avances (daily standup si es equipo)

---

✅ **¡Listo para ejecutar!**  
Cada checkbox te permite visualizar el progreso día a día. Puedes copiar este plan a Notion, Trello, GitHub Projects, o simplemente imprimirlo y marcarlo manualmente.

¿Quieres que te genere también una plantilla en formato **Notion** o **Markdown para GitHub**? ¡Solo dime y lo preparo!

¡Vamos por ese MVP en 5 días! 💪🚀