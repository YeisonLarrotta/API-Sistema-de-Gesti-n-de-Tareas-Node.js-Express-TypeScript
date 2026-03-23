"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
exports.registerSchema = {
    type: 'object',
    properties: {
        nombre: { type: 'string', minLength: 2, maxLength: 80 },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6, maxLength: 128 },
    },
    required: ['nombre', 'email', 'password'],
    additionalProperties: false,
};
exports.loginSchema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6, maxLength: 128 },
    },
    required: ['email', 'password'],
    additionalProperties: false,
};
