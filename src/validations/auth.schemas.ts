import { JSONSchemaType } from 'ajv';

export interface RegisterBody {
  nombre: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export const registerSchema: JSONSchemaType<RegisterBody> = {
  type: 'object',
  properties: {
    nombre: { type: 'string', minLength: 2, maxLength: 80 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6, maxLength: 128 },
  },
  required: ['nombre', 'email', 'password'],
  additionalProperties: false,
};

export const loginSchema: JSONSchemaType<LoginBody> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6, maxLength: 128 },
  },
  required: ['email', 'password'],
  additionalProperties: false,
};
