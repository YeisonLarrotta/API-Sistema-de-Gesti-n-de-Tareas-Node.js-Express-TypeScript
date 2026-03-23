import swaggerJSDoc from 'swagger-jsdoc';

const appUrl =
  process.env.APP_URL ??
  'http://sistemadegestiondetareas-env.eba-5hhjm9jv.us-east-1.elasticbeanstalk.com';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Sistema de Gestion de Tareas API',
      version: '1.0.0',
      description: 'API REST con autenticacion JWT y CRUD de tareas.',
    },
    servers: [{ url: appUrl }, { url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['nombre', 'email', 'password'],
          properties: {
            nombre: { type: 'string', example: 'Yair' },
            email: { type: 'string', format: 'email', example: 'yair@mail.com' },
            password: { type: 'string', minLength: 6, example: '123456' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'yair@mail.com' },
            password: { type: 'string', minLength: 6, example: '123456' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 1 },
            titulo: { type: 'string', example: 'Preparar entrevista tecnica' },
            descripcion: { type: 'string', example: 'Repasar JWT y PostgreSQL' },
            fecha_vencimiento: { type: 'string', format: 'date', nullable: true },
            estado: {
              type: 'string',
              enum: ['pendiente', 'en curso', 'completada'],
              example: 'pendiente',
            },
          },
        },
      },
    },
    paths: {
      '/health': {
        get: {
          summary: 'Health check',
          responses: {
            '200': {
              description: 'Servidor arriba',
            },
          },
        },
      },
      '/auth/register': {
        post: {
          summary: 'Registrar usuario',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterRequest' },
              },
            },
          },
          responses: {
            '201': { description: 'Usuario creado' },
            '400': { description: 'Datos invalidos' },
          },
        },
      },
      '/auth/login': {
        post: {
          summary: 'Iniciar sesion',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Token generado' },
            '401': { description: 'Credenciales invalidas' },
          },
        },
      },
      '/tasks': {
        get: {
          summary: 'Listar tareas del usuario autenticado',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Lista de tareas' } },
        },
        post: {
          summary: 'Crear tarea',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['titulo'],
                  properties: {
                    titulo: { type: 'string' },
                    descripcion: { type: 'string' },
                    fecha_vencimiento: { type: 'string', format: 'date' },
                    estado: { type: 'string', enum: ['pendiente', 'en curso', 'completada'] },
                  },
                },
              },
            },
          },
          responses: { '201': { description: 'Tarea creada' } },
        },
      },
      '/tasks/{id}': {
        get: {
          summary: 'Obtener tarea por id',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            '200': { description: 'Tarea encontrada' },
            '404': { description: 'No encontrada' },
          },
        },
        put: {
          summary: 'Actualizar tarea',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    titulo: { type: 'string' },
                    descripcion: { type: 'string' },
                    fecha_vencimiento: { type: 'string', format: 'date' },
                    estado: { type: 'string', enum: ['pendiente', 'en curso', 'completada'] },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Tarea actualizada' },
            '404': { description: 'No encontrada' },
          },
        },
        delete: {
          summary: 'Eliminar tarea',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            '200': { description: 'Tarea eliminada' },
            '404': { description: 'No encontrada' },
          },
        },
      },
      '/tasks/{id}/complete': {
        patch: {
          summary: 'Marcar tarea como completada',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            '200': { description: 'Tarea completada' },
            '404': { description: 'No encontrada' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);
