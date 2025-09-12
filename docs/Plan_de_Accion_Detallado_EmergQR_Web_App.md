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

## ✅ **Fase 3: Funcionalidades Avanzadas y Pulido Final (Completado)**
- [x] **Línea de Tiempo Médica Unificada**: Vista cronológica de todo el historial de salud.
- [x] **Gestión de Contraseña desde el Perfil**: Formulario para que el usuario cambie su propia contraseña.
- [x] **Restablecimiento de Contraseña Olvidada**: Flujo completo para recuperar la cuenta desde la página de Login.
- [x] **Búsqueda Inteligente de Enfermedades y Alergias**: Buscador conectado a bases de datos médicas (SNOMED).
- [x] **Gestión de Direcciones Completa**: Funcionalidad para añadir, editar y eliminar la dirección del usuario.
- [x] **Campos de Datos de Emergencia**: Implementados y funcionales los campos para Grupo Sanguíneo y Sistema de Salud.
- [x] **Eliminación de Cuenta Segura**: El usuario puede eliminar su cuenta de forma segura desde su perfil.
- [x] **Perfil de Usuario Completo**: Añadidos y funcionales los campos de `sexo` y `ocupación`.
- [x] **Internacionalización (i18n) y Sincronización de Idioma**: La aplicación está traducida a 5 idiomas y la preferencia del usuario se guarda en el backend.

---

## ✅ **Fase 4: Expansión del Perfil de Salud (Completado)**
- [x] **Módulo de Adicciones**: CRUD completo conectado al backend.
- [x] **Módulo de Enfermedades Infecciosas**: CRUD completo conectado al backend.
- [x] **Módulo de Condiciones Psiquiátricas**: CRUD completo conectado al backend.
- [x] **Módulo de Seguimiento de Ciclo Menstrual**: CRUD completo conectado al backend.
- [x] **Módulo de Seguimiento de Embarazo**: CRUD completo conectado al backend.
- [x] **Botón de Pánico**: Funcionalidad conectada al backend.
- [x] **Navegación Condicional**: Los menús de Ciclo Menstrual y Embarazo se muestran según el sexo del perfil.

---

## ✅ **Fase 5: Calidad de Proyecto y Mantenibilidad (Completado)**
- [x] **Implementación de Pruebas Unitarias y de Integración**: Se ha configurado el entorno de pruebas con Jest y React Testing Library.
- [x] **Generación de Documentación Automática**: Se ha implementado TypeDoc para generar documentación técnica a partir de los comentarios del código.

---

## 🚀 **Fase 6: Administración y Mejoras Futuras (Pendiente)**

### ⭐ **Tareas Priorizadas**

- [ ] **Panel de Administración de Usuarios**
  - **Descripción**: Crear una nueva sección protegida para administradores (`is_admin: true`) que permita visualizar, buscar y gestionar perfiles de usuario (ej. editar datos, desactivar cuentas).
  - **Endpoints Requeridos**: `GET /api/v1/clients/`, `GET /api/v1/clients/{uuid}`, `DELETE /api/v1/clients/{uuid}`.
  - **Estado**: Pendiente.

- [ ] **Sistema de Acceso Remoto Temporal y Revocable**
  - **Descripción**: Implementar el flujo completo para que usuarios externos soliciten acceso, los administradores lo aprueben (con duración) y lo revoquen.
  - **Endpoints Requeridos**: `POST /api/v1/access-requests`, `POST /api/v1/activate-account`, `GET /api/v1/admin/access-requests`, etc.
  - **Estado**: Pendiente.

---

## 📌 Notas Adicionales

- **Próxima Tarea**: Implementar el Panel de Administración de Usuarios.
- **Feedback Loop**: Continuar con la revisión de funcionalidades y la priorización según las necesidades que surjan.

✅ **¡Plan actualizado y listo para seguir avanzando!**
