# DEVELOPMENT_LOG

## Resumen del proyecto
Construccion de una API REST para autenticacion de usuarios y gestion de tareas personales usando Node.js, Express, TypeScript y PostgreSQL (Supabase).

## Retos y soluciones

### 1) Conexion a Supabase
- **Problema:** errores intermitentes `ENOTFOUND` y `Tenant or user not found`.
- **Causa detectada:** diferencias entre conexion directa y pooler, ademas de validacion de credenciales.
- **Solucion aplicada:** pruebas de conectividad por host/puerto y ajuste de la `DATABASE_URL` segun el entorno de red.

### 2) Logging disperso
- **Problema:** uso de `console.log` y `console.error` distribuidos en varios archivos.
- **Solucion aplicada:** centralizacion de logs en `src/utils/logger.ts` y limpieza del codigo de controladores/servicios.

### 3) Cobertura incompleta de CRUD de tareas
- **Problema:** faltaban endpoints para consultar tarea por id y actualizar tarea.
- **Solucion aplicada:** se agregaron `GET /tasks/:id` y `PUT /tasks/:id`, con validacion basica de ownership por `user_id`.

## Uso de asistentes de IA

### Uso significativo 1: diagnostico de conexion a BD
- **Prompt utilizado:** "Puedes ayudarme? no me conecta con la Base de datos de Supabase".
- **Que se acepto y por que:** pruebas de conectividad DNS/TCP y ajuste de formato de cadena de conexion; fue util para aislar causa de red vs credenciales.
- **Que se rechazo o modifico:** no se adopto ciegamente cada cadena propuesta; se validaron contra errores reales de ejecucion.
- **Verificacion realizada:** ejecucion de pruebas con cliente `pg`, lectura de errores reales y comprobacion de conectividad.

### Uso significativo 2: mejora de calidad de codigo
- **Prompt utilizado:** "Ayudame a borrar todos los console.log del proyecto".
- **Que se acepto y por que:** eliminacion de logs de debug y creacion de logger central para mantener trazabilidad sin ruido.
- **Que se rechazo o modifico:** se mantuvieron mensajes de error a traves del logger para no perder observabilidad.
- **Verificacion realizada:** busqueda global de `console.*` en `src` y revision de lint.

### Uso significativo 3: alineacion a requisitos de la vacante
- **Prompt utilizado:** especificacion completa de arquitectura, autenticacion, CRUD, validacion, documentacion y bitacora.
- **Que se acepto y por que:** priorizacion de tareas de alto impacto para evaluacion (README, bitacora, endpoints faltantes).
- **Que se rechazo o modifico:** implementaciones demasiado grandes en un solo paso; se eligio iterar por bloques verificables.
- **Verificacion realizada:** revision de estructura de carpetas, endpoints disponibles y consistencia de documentacion.

## Decisiones sin asistencia de IA
1. **Usar arquitectura en capas** (`api`, `controllers`, `services`, `persistence`) para mantener separacion de responsabilidades y facilitar escalabilidad.
2. **Asociar todas las operaciones de tareas al `user_id` del JWT** para garantizar aislamiento de datos entre usuarios.

## Proximos pasos recomendados
1. Agregar validacion formal con AJV en auth y tasks.
2. Integrar Swagger/OpenAPI y exponer `/docs`.
3. Completar JSDoc en controladores y servicios.
4. Agregar pruebas unitarias/integracion (Jest o Vitest).
