# Guía para Frontend y Móvil: Implementación de Preferencia de Idioma

## 1. Resumen General

El backend ha sido actualizado para permitir que los usuarios guarden su idioma de preferencia y para que las aplicaciones cliente (web y móvil) puedan solicitar respuestas en un idioma específico.

La implementación se basa en dos conceptos clave:
1.  **Persistencia:** La preferencia de idioma del usuario se guarda en su perfil en la base de datos.
2.  **Comunicación por Petición:** El cliente (la app) debe informar al backend en qué idioma desea recibir las respuestas en cada petición a través de un encabezado HTTP.

---

## 2. Cambios en la API

### A. Nuevo Endpoint: Actualizar Idioma del Usuario

Se ha añadido un nuevo endpoint para permitir que el usuario cambie y guarde su idioma de preferencia.

- **Endpoint:** `PATCH /api/v1/clients/me/language`
- **Método:** `PATCH`
- **Autenticación:** Requerida (Token JWT del usuario).
- **Body (Cuerpo de la petición):**
  ```json
  {
    "preferred_language": "en"
  }
  ```
- **Respuesta Exitosa (200 OK):**
  Devolverá el perfil actualizado del usuario, incluyendo la nueva preferencia de idioma.

### B. Campo Adicional en la Respuesta de Login y Perfil

El objeto del cliente que se devuelve en las respuestas de la API ahora incluye un nuevo campo.

- **Campo:** `preferred_language`
- **Tipo:** `string`
- **Ejemplo:** `"es"`, `"en"`, `"pt"`
- **Endpoints Afectados:**
  - `POST /api/v1/auth/login`
  - `GET /api/v1/clients/me/profile`
  - Cualquier otro endpoint que devuelva el perfil del cliente.

---

## 3. Flujo de Trabajo Recomendado

Este es el flujo de trabajo que las aplicaciones cliente deben implementar.

1.  **Al Iniciar Sesión (Login):**
    - Después de un login exitoso, la aplicación debe leer el campo `preferred_language` de la respuesta.
    - Guardar este valor en el estado global de la aplicación (Zustand, Redux, etc.). Este será el "idioma activo".

2.  **En la Configuración del Perfil:**
    - La aplicación debe mostrar una opción para que el usuario cambie su idioma (ej: un menú desplegable).
    - Cuando el usuario selecciona un nuevo idioma, la aplicación debe hacer una llamada al nuevo endpoint `PATCH /api/v1/clients/me/language` con el nuevo código de idioma.
    - Tras una respuesta exitosa, la aplicación debe actualizar el "idioma activo" en su estado global.

---

## 4. Envío del Idioma en Cada Petición (Header)

Esta es la parte más importante para la comunicación continua.

- **Qué hacer:** En **TODAS** las peticiones que la aplicación haga a la API, debe incluir el encabezado (header) HTTP `Accept-Language`.
- **Valor del header:** El valor debe ser el "idioma activo" que está guardado en el estado de la aplicación.

- **Ejemplo de una petición `GET`:**
  ```http
  GET /api/v1/medical-history/
  Authorization: Bearer <tu_jwt_token>
  Accept-Language: es
  ```

**¿Por qué es importante?**
Esto le permite al backend saber en qué idioma responder. En el futuro, si traducimos los mensajes de error o cualquier otro texto, el backend podrá devolver la versión correcta automáticamente basándose en este header.
