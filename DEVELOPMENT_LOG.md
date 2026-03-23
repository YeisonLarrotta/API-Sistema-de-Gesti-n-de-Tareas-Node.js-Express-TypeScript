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

### 4) Despliegue en AWS Elastic Beanstalk
- **Problema:** el entorno desplegaba, pero los endpoints de autenticacion (`/auth/register` y `/auth/login`) devolvian `500`.
- **Causa detectada:** configuracion incompleta en entorno productivo (variables de entorno, version de despliegue y validaciones de infraestructura).
- **Solucion aplicada:** se ajusto `package.json` para evitar build en `postinstall` en runtime, se genero un zip limpio con `.ebignore`, se configuraron variables (`PORT`, `JWT_SECRET`, `DATABASE_URL`) y se re-deployo version por version validando `/health` y `/docs`.

### 5) Acceso publico y conectividad por dispositivo
- **Problema:** la URL de AWS abria en algunos dispositivos, pero en otros (Android) se quedaba cargando.
- **Causa detectada:** reglas de red y diferencias de comportamiento entre clientes HTTP/no seguro.
- **Solucion aplicada:** se revisaron reglas de inbound en Security Group (HTTP 80 publico), se valido estado del entorno y se priorizo exponer endpoints publicos de validacion (`/health` y `/docs`) para entrega tecnica.

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

### Uso significativo 4: resolucion guiada de despliegue en AWS
- **Prompt utilizado:** "Ayudame a desplegar en AWS Elastic Beanstalk paso a paso y depurar por que `/health` funciona pero `/auth/register` y `/auth/login` responden 500".
- **Que se acepto y por que:** diagnostico por capas (app viva vs fallo de BD), verificacion de estado del entorno, ajuste de variables en EB y recomendaciones de redeploy con validaciones posteriores.
- **Que se rechazo o modifico:** cambios de infraestructura innecesarios para una prueba junior (arquitecturas complejas, sobreconfiguracion de servicios).
- **Verificacion realizada:** pruebas HTTP reales repetidas contra endpoints publicos (`/health`, `/docs`, `/auth/register`, `/auth/login`) y comprobacion de comportamiento antes y despues de cada ajuste.

### Uso significativo 5: prompts estrategicos para depuracion
- **Prompt utilizado (diagnostico rapido):** "Ejecuta pruebas reales contra mi API en AWS y dime solo: endpoint, status code y posible causa".
- **Prompt utilizado (foco en causa raiz):** "No me des teoria; guiame a encontrar el error exacto en logs de Elastic Beanstalk y la variable concreta a corregir".
- **Prompt utilizado (cierre para entrega):** "Dame checklist final de entrega tecnica: GitHub, Swagger, health check, riesgos conocidos y mensaje para reclutador".
- **Que se acepto y por que:** prompts orientados a evidencia, reproducibilidad y cierre de entrega.
- **Que se rechazo o modifico:** respuestas largas sin accion inmediata; se priorizaron pasos concretos y verificables.
- **Verificacion realizada:** cada prompt termino en una accion medible (comando, cambio de configuracion o prueba de endpoint).

## Decisiones sin asistencia de IA
1. **Usar arquitectura en capas** (`api`, `controllers`, `services`, `persistence`) para mantener separacion de responsabilidades y facilitar escalabilidad.
2. **Asociar todas las operaciones de tareas al `user_id` del JWT** para garantizar aislamiento de datos entre usuarios.

## Proximos pasos recomendados
1. Agregar validacion formal con AJV en auth y tasks.
2. Integrar Swagger/OpenAPI y exponer `/docs`.
3. Completar JSDoc en controladores y servicios.
4. Agregar pruebas unitarias/integracion (Jest o Vitest).
