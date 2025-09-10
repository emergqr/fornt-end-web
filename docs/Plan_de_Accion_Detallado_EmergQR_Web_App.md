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
- [x] **Internacionalización (i18n) y Documentación Técnica Integral**: Toda la aplicación ha sido traducida a 5 idiomas y el código ha sido completamente documentado.

---

<!--
## 🚀 **Fase 4: Funcionalidades de Administración y Expansión del Perfil (En Progreso)**

**Nota: La navegación a esta fase está deshabilitada hasta que el backend esté completamente funcional.**

### ⭐ **Tareas Priorizadas**

- [x] **Nuevas Secciones Médicas: Adicciones y Enfermedades Infectocontagiosas**
  - **Descripción**: Crear dos nuevos módulos en el dashboard para que los usuarios puedan registrar adicciones y enfermedades infectocontagiosas.
  - **Estado**: **Completado** (Frontend).

- [x] **Botón de Pánico**
  - **Descripción**: Implementar un Botón de Acción Flotante (FAB) en el dashboard que, previa confirmación, envíe una notificación de emergencia a los contactos designados.
  - **Estado**: **Completado** (Frontend). Bloqueado a la espera del endpoint del backend.

- [ ] **Panel de Administración de Usuarios**
  - **Descripción**: Crear una nueva sección protegida para administradores (`is_admin: true`) que permita gestionar perfiles de usuario.
  - **Estado**: **En Progreso**. Esqueleto de UI y `store` con datos simulados implementado. Bloqueado a la espera de endpoints de backend.

### ⭐ **Esqueleto de Frontend para Futuras Funcionalidades**

- [ ] **Módulo de Salud Mental**
  - **Descripción**: Crear la estructura inicial (interfaces, servicios simulados, traducciones y enlace de navegación desactivado) para un futuro módulo de seguimiento de salud mental (ej. enfermedades psiquiátricas, estado de ánimo).
  - **Valor**: Expande el perfil de salud a un área crítica y a menudo descuidada.
  - **Estado**: Pendiente.

- [ ] **Módulo de Seguimiento Menstrual**
  - **Descripción**: Crear la estructura inicial para un futuro módulo de seguimiento del ciclo menstrual.
  - **Valor**: Añade una funcionalidad de alto valor y muy personal para una gran parte de la base de usuarios.
  - **Estado**: Pendiente.

- [ ] **Módulo de Seguimiento de Embarazo**
  - **Descripción**: Crear la estructura inicial para un futuro módulo de seguimiento del embarazo.
  - **Valor**: Proporciona una herramienta de seguimiento detallado para un período de salud crítico.
  - **Estado**: Pendiente.
-->

---

## 🚀 **Fase 5: Calidad de Proyecto y Mantenibilidad (Pendiente)**

### ⭐ **Tareas Priorizadas**

- [ ] **Implementación de Pruebas Unitarias y de Integración**
  - **Descripción**: Configurar el entorno de pruebas con **Jest** y **React Testing Library**. Desarrollar un conjunto sólido de pruebas para los componentes, servicios y stores, asegurando la estabilidad del código y previniendo regresiones.
  - **Valor**: Aumenta la confianza en los despliegues, facilita la refactorización y garantiza el correcto funcionamiento de la lógica de negocio.

- [ ] **Generación de Documentación Automática**
  - **Descripción**: Implementar **TypeDoc** para generar un sitio web de documentación HTML a partir de los comentarios técnicos existentes en el código. Configurar un script (`docs:generate`) en `package.json` para automatizar este proceso.
  - **Valor**: Proporciona una documentación técnica siempre actualizada, accesible y fácil de navegar, crucial para la escalabilidad del proyecto y la incorporación de nuevos desarrolladores.

---

## 📌 Notas Adicionales

- **Próxima Tarea**: El siguiente gran desafío es el desarrollo de la **aplicación móvil**.
- **Feedback Loop**: Continuar con la revisión de funcionalidades y la priorización según las necesidades que surjan.

✅ **¡Plan actualizado y listo para seguir avanzando!**
