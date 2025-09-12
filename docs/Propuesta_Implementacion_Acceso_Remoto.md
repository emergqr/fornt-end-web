## Propuesta de Implementación: Sistema de Acceso Remoto Temporal y Revocable

### 1. Resumen de la Funcionalidad

El objetivo es implementar un sistema donde un usuario externo (sin cuenta) pueda solicitar acceso a la aplicación. Un administrador podrá revisar estas solicitudes y conceder acceso por un tiempo definido (o de forma permanente). El administrador también tendrá la capacidad de revocar dicho acceso en cualquier momento. Este sistema debe ser seguro, auditable y estar integrado en la aplicación existente, considerando las diferentes experiencias en la web y en la futura aplicación móvil.

### 2. Estrategia de Implementación (Mínimo Impacto)

Para minimizar la disrupción, la estrategia se basa en integrar esta funcionalidad como un módulo cohesivo dentro de la arquitectura actual. Reutilizaremos conceptos existentes como el flag `is_admin` de los usuarios y la estructura de servicios y stores de Zustand, asegurando que la lógica del backend sea agnóstica a la plataforma (web o móvil).

---

### 3. Mejoras y Cambios Requeridos (Propuesta Técnica)

--- 

### 3.1. Backend (API y Lógica Central)

Esta es la base de la funcionalidad y será consumida tanto por el frontend web como por el móvil.

**Nuevas Tablas en la Base de Datos:**

1.  **`access_requests`**: Almacenará las solicitudes de los usuarios externos.
    - `id`, `email`, `name`, `reason`, `status` ('pending', 'approved', 'rejected'), `requested_at`, `reviewed_by` (admin_id), `reviewed_at`.

2.  **`permissions`**: Guardará los permisos concedidos, su duración y estado.
    - `id`, `user_id` (FK a `clients`), `granted_by` (admin_id), `expires_at` (timestamp, nullable para acceso permanente), `revoked_at` (timestamp, nullable), `revoked_by` (admin_id).

**Nuevos Endpoints en `openapi.json`:**

- **Públicos (Para Solicitud y Activación):**
    - `POST /api/v1/access-requests`: Para que un usuario sin cuenta envíe una solicitud de acceso.
    - `POST /api/v1/activate-account`: Para que un usuario aprobado active su cuenta y establezca su contraseña usando un token.

- **Protegidos (Para Administradores):**
    - `GET /api/v1/admin/access-requests`: Para listar todas las solicitudes (con filtros por estado).
    - `POST /api/v1/admin/access-requests/{request_id}/approve`: Para aprobar una solicitud. El body incluirá la duración (`{ "duration_hours": 72 }` o `{ "permanent": true }`).
    - `POST /api/v1/admin/access-requests/{request_id}/reject`: Para rechazar una solicitud.
    - `GET /api/v1/admin/permissions`: Para listar todos los permisos activos y revocados.
    - `POST /api/v1/admin/permissions/{permission_id}/revoke`: Para revocar un permiso activo.

**Lógica del Middleware de Permisos:**

- El middleware de la API, después de validar el JWT de un usuario, deberá consultar la tabla `permissions` para asegurar que el `user_id` tiene un permiso activo (`revoked_at IS NULL` y `expires_at` no ha pasado).

--- 

### 3.2. Frontend (Aplicación Web)

La aplicación web tendrá dos visiones principales para esta funcionalidad.

**Visión 1: Usuario Externo (No Autenticado)**

- **Nueva Página Pública `/request-access`**: Un formulario sencillo y accesible desde la página de inicio para que cualquier persona pueda solicitar acceso.
- **Nueva Página Pública `/activate-account?token=...`**: Una página para que el usuario, tras recibir el email de aprobación, pueda establecer su contraseña y activar su cuenta.

**Visión 2: Administrador (Autenticado)**

- **Nueva Página Protegida `/dashboard/admin/access-control`**: 
    - Será visible en el menú de navegación lateral **solo si `user.is_admin` es `true`**.
    - Tendrá una interfaz con pestañas para "Solicitudes Pendientes" y "Permisos Activos".
    - Desde aquí, el admin podrá aprobar/rechazar solicitudes con un modal para definir la duración del acceso, y revocar permisos existentes con un clic.
- **Nuevos Artefactos de Código:**
    - **`accessRequestService.ts`**: Servicio para interactuar con los endpoints de la API.
    - **`useAccessControlStore.ts`**: Store de Zustand para manejar el estado del panel de administración.

--- 

### 3.3. Frontend (Aplicación Móvil)

La aplicación móvil se centrará principalmente en la **gestión por parte de los administradores** y en la **experiencia del usuario regular cuyo acceso es revocado**.

**Visión 1: Administrador (Autenticado)**

- **Nueva Pantalla de Gestión de Accesos**: Se añadirá una nueva sección en el menú de la app móvil, visible solo para administradores.
    - Esta pantalla consumirá los **mismos endpoints** (`/api/v1/admin/...`) que la aplicación web para listar solicitudes y permisos.
    - Permitirá a un administrador aprobar, rechazar o revocar accesos directamente desde su teléfono, haciendo la gestión verdaderamente remota.
- **Notificaciones Push**: El backend deberá integrarse con un servicio de notificaciones (como Firebase Cloud Messaging) para enviar una notificación push al dispositivo del administrador cuando llegue una nueva solicitud de acceso, permitiendo una respuesta inmediata.

**Visión 2: Usuario Regular (Autenticado)**

- **Manejo de Sesión Revocada**: La principal responsabilidad de la app móvil para un usuario regular es manejar el caso en que su acceso sea revocado mientras tiene una sesión activa.
    - Si una petición a la API devuelve un error `403 Forbidden` (indicando que el permiso fue revocado), la aplicación móvil deberá:
        1.  Cerrar la sesión del usuario localmente (borrar el JWT).
        2.  Redirigirlo a la pantalla de login.
        3.  Mostrar un mensaje informativo claro, como "Tu acceso ha sido revocado por un administrador. Por favor, contacta con soporte si crees que es un error."

- **No se implementará** el formulario de solicitud de acceso en la app móvil, ya que su público objetivo son usuarios que ya tienen una cuenta activa.
