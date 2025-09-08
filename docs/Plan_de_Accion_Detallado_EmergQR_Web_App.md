# 🚀 **Plan de Acción: EmergQR Web App**
**Objetivo**: Construir una aplicación web completa y robusta para la gestión de perfiles de salud de emergencia.

---

## ✅ **Fase 1: MVP (Completado)**
- [x] Setup del Proyecto
- [x] Páginas Públicas
- [x] Autenticación y Acceso Privado
- [x] Funcionalidad Central del Perfil
- [x] Gestión de Contactos de Emergencia

---

## ✅ **Fase 2: Módulos de Salud (Completado)**
- [x] Gestión de Alergias, Enfermedades, Medicamentos, Signos Vitales e Historial Médico.
- [x] Dashboard Principal con widgets y gráficos.
- [x] Sistema avanzado de temas con 6 paletas de colores.

---

## 🚀 **Fase 3: Funcionalidades Avanzadas (En Progreso)**

### ⭐ **Completadas en esta fase**

- [x] **Línea de Tiempo Médica Unificada**: Vista cronológica de todo el historial de salud.
- [x] **Gestión de Contraseña desde el Perfil**: Formulario para que el usuario cambie su propia contraseña.
- [x] **Restablecimiento de Contraseña Olvidada**: Flujo completo para recuperar la cuenta desde la página de Login.
- [x] **Búsqueda Inteligente de Enfermedades y Alergias**: Buscador conectado a bases de datos médicas (SNOMED) para estandarizar los datos.

### ⭐ **Tareas Pendientes (Priorizadas)**

- [ ] **Gestión de Direcciones (En curso)**
  - **Descripción**: Añadir una sección en el perfil para que el usuario pueda gestionar sus direcciones postales (añadir, editar, eliminar).
  - **Valor**: Dato clave para emergencias.
  - **Endpoints**: CRUD en `/api/v1/addresses/`.

- [ ] **Campos de Datos de Emergencia**
  - **Descripción**: Añadir campos específicos en el perfil para **Grupo Sanguíneo** y **Sistema de Salud / Nº de Póliza**.
  - **Valor**: Información de altísimo valor para los servicios de emergencia.
  - **Endpoint**: `PUT /api/v1/emerg-data/me`.

- [ ] **Eliminación de Cuenta**
  - **Descripción**: Añadir un botón en una sección de "Ajustes Avanzados" para que el usuario pueda eliminar su cuenta.
  - **Valor**: Otorga al usuario control total sobre sus datos.
  - **Endpoint**: `DELETE /api/v1/clients/me`.

- [ ] **Completar Campos de Perfil**
  - **Descripción**: Añadir los campos de `sexo` y `ocupación` al formulario del perfil.
  - **Valor**: Enriquece el perfil demográfico del usuario.
  - **Endpoint**: `PUT /api/v1/clients/me`.

---

## 📌 Notas Adicionales

- **Próxima Tarea**: Cuando estemos listos, el siguiente gran desafío será la **aplicación móvil**.
- **Feedback Loop**: Continuar con la revisión de funcionalidades y la priorización según las necesidades que surjan.

✅ **¡Plan actualizado y listo para seguir avanzando!**