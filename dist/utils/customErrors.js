"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.ForbiddenError = exports.ValidationError = exports.AuthenticationError = exports.NotFoundError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    constructor(message = 'Recurso no encontrado') {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class AuthenticationError extends AppError {
    constructor(message = 'No autorizado') {
        super(message, 401);
    }
}
exports.AuthenticationError = AuthenticationError;
class ValidationError extends AppError {
    constructor(message = 'Datos de entrada invalidos') {
        super(message, 400);
    }
}
exports.ValidationError = ValidationError;
class ForbiddenError extends AppError {
    constructor(message = 'Acceso prohibido') {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
class ConflictError extends AppError {
    constructor(message = 'Conflicto en la operacion') {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
