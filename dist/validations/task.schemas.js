"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskSchema = exports.createTaskSchema = exports.taskIdParamSchema = void 0;
exports.taskIdParamSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', pattern: '^[0-9]+$' },
    },
    required: ['id'],
    additionalProperties: false,
};
exports.createTaskSchema = {
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
exports.updateTaskSchema = {
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
