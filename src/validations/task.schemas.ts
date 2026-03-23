import { JSONSchemaType } from 'ajv';

type TaskStatus = 'pendiente' | 'en curso' | 'completada';

export interface TaskParams {
  id: string;
}

export interface CreateTaskBody {
  titulo: string;
  descripcion?: string;
  fecha_vencimiento?: string;
  estado?: TaskStatus;
}

export interface UpdateTaskBody {
  titulo?: string;
  descripcion?: string;
  fecha_vencimiento?: string;
  estado?: TaskStatus;
}

export const taskIdParamSchema: JSONSchemaType<TaskParams> = {
  type: 'object',
  properties: {
    id: { type: 'string', pattern: '^[0-9]+$' },
  },
  required: ['id'],
  additionalProperties: false,
};

export const createTaskSchema: JSONSchemaType<CreateTaskBody> = {
  type: 'object',
  properties: {
    titulo: { type: 'string', minLength: 1, maxLength: 150 },
    descripcion: { type: 'string', nullable: true, maxLength: 2000 },
    fecha_vencimiento: { type: 'string', format: 'date', nullable: true },
    estado: {
      type: 'string',
      nullable: true,
      enum: ['pendiente', 'en curso', 'completada'],
    },
  },
  required: ['titulo'],
  additionalProperties: false,
};

export const updateTaskSchema: JSONSchemaType<UpdateTaskBody> = {
  type: 'object',
  properties: {
    titulo: { type: 'string', nullable: true, minLength: 1, maxLength: 150 },
    descripcion: { type: 'string', nullable: true, maxLength: 2000 },
    fecha_vencimiento: { type: 'string', format: 'date', nullable: true },
    estado: {
      type: 'string',
      nullable: true,
      enum: ['pendiente', 'en curso', 'completada'],
    },
  },
  required: [],
  additionalProperties: false,
  anyOf: [
    { required: ['titulo'] },
    { required: ['descripcion'] },
    { required: ['fecha_vencimiento'] },
    { required: ['estado'] },
  ],
};
