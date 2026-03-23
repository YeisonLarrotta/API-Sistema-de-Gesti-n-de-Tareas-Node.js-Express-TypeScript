"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const customErrors_1 = require("../utils/customErrors");
/**
 * Valida el JWT enviado en el header Authorization.
 * Si es valido, agrega `req.user` para las rutas protegidas.
 */
const authenticateToken = (req, res, next) => {
    // 1. Obtener el token del header (Bearer Token)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return next(new customErrors_1.AuthenticationError('Acceso denegado. No se proporciono un token.'));
    }
    try {
        // 2. Verificar si el token es válido
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
        // 3. Guardar los datos del usuario dentro de la petición para usarlo después
        req.user = decoded;
        // 4. Continuar al siguiente paso (el controlador)
        next();
    }
    catch (error) {
        next(new customErrors_1.ForbiddenError('Token invalido o expirado.'));
    }
};
exports.authenticateToken = authenticateToken;
