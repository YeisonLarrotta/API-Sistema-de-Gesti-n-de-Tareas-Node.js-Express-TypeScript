# Sistema de Gestion de Tareas API

API RESTful para registro de usuarios, autenticacion con JWT y gestion de tareas personales.

## Stack tecnologico
- Node.js
- Express
- TypeScript
- PostgreSQL (Supabase)
- JWT + bcryptjs

## Arquitectura del proyecto
El proyecto sigue una arquitectura en capas:

- `src/api`: definicion de rutas.
- `src/controllers`: manejo de peticiones y respuestas HTTP.
- `src/services`: logica de negocio.
- `src/persistence`: acceso a base de datos.
- `src/middlewares`: autenticacion y manejo de errores.
- `src/config`: configuracion centralizada.
- `src/utils`: utilidades (errores custom, logger).

## Requisitos previos
- Node.js 18+ (recomendado 20+)
- Cuenta y proyecto de Supabase
- Base de datos con tablas `users` y `tasks`

## Instalacion local
1. Instalar dependencias:
   - `npm install`
2. Copiar variables de entorno:
   - Copia `.env.example` a `.env`
3. Completar variables de entorno en `.env`
4. Ejecutar en desarrollo:
   - `npm run dev`

## Variables de entorno
Archivo `.env`:

- `PORT=3000`
- `JWT_SECRET=tu_clave_jwt`
- `DATABASE_URL=tu_cadena_postgresql`

Ejemplo de conexion (pooler Supabase):
- `postgresql://postgres.<project_ref>:<password>@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true`

## Endpoints

### Auth
- `POST /auth/register`
  - Body:
    - `{ "nombre": "Yair", "email": "yair@email.com", "password": "123456" }`
- `POST /auth/login`
  - Body:
    - `{ "email": "yair@email.com", "password": "123456" }`
  - Respuesta:
    - token JWT + datos del usuario

### Tasks (protegidas con Bearer token)
- `POST /tasks`
  - Crea una tarea del usuario autenticado.
  - Body sugerido:
    - `{ "titulo": "Estudiar TypeScript", "descripcion": "Repasar tipos", "fecha_vencimiento": "2026-04-01", "estado": "pendiente" }`
- `GET /tasks`
  - Lista solo tareas del usuario autenticado.
- `GET /tasks/:id`
  - Obtiene una tarea especifica (solo si es del usuario autenticado).
- `PUT /tasks/:id`
  - Actualiza campos de una tarea propia.
- `PATCH /tasks/:id/complete`
  - Marca la tarea como completada.
- `DELETE /tasks/:id`
  - Elimina una tarea propia.

## Seguridad implementada
- Passwords hasheadas con `bcryptjs`.
- Login con JWT.
- Middleware `authenticateToken` para proteger rutas privadas.
- Filtro por `user_id` para evitar acceso entre usuarios.

## Manejo de errores
- Clases de error personalizadas en `src/utils/customErrors.ts`.
- Middleware global de errores en `src/middlewares/errorHandler.ts`.

## Scripts disponibles
- `npm run dev`: modo desarrollo con recarga.
- `npm run build`: compila TypeScript.
- `npm start`: ejecuta version compilada.

## Swagger
- Documentacion disponible en: `http://localhost:3000/docs`
- Incluye endpoints de health, auth y tasks con esquema Bearer JWT.

## Estado actual y siguientes pasos
Pendiente para dejar la prueba tecnica aun mas fuerte:
- Pruebas unitarias/integracion (Vitest o Jest).
- Documentacion JSDoc mas completa.