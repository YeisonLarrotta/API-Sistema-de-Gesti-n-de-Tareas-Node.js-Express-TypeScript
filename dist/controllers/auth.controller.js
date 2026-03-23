"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const logger_1 = require("../utils/logger");
const customErrors_1 = require("../utils/customErrors");
const authService = new auth_service_1.AuthService();
/**
 * Registra un nuevo usuario y devuelve sus datos publicos.
 */
const register = async (req, res, next) => {
    try {
        const { nombre, email, password } = req.body;
        const user = await authService.register(nombre, email, password);
        res.status(201).json({
            message: 'Usuario creado con éxito',
            user
        });
    }
    catch (error) {
        logger_1.logger.error('DETALLE DEL ERROR REGISTRO', error?.message);
        if (error instanceof customErrors_1.AppError)
            return next(error);
        if (error?.code === '23505')
            return next(new customErrors_1.ConflictError('El email ya esta registrado'));
        return next(error);
    }
};
exports.register = register;
/**
 * Valida credenciales y entrega un JWT.
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Llamamos al servicio para validar y obtener el token
        const result = await authService.login(email, password);
        // Si todo sale bien, devolvemos el token y los datos del usuario
        res.status(200).json({
            message: 'Login exitoso',
            ...result
        });
    }
    catch (error) {
        logger_1.logger.error('DETALLE DEL ERROR LOGIN', error?.message);
        if (error instanceof customErrors_1.AppError)
            return next(error);
        return next(new customErrors_1.AuthenticationError(error?.message ?? 'Credenciales invalidas'));
    }
};
exports.login = login;
