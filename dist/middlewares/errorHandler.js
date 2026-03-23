"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const customErrors_1 = require("../utils/customErrors");
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, next) => {
    if (err instanceof customErrors_1.AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    // Error inesperado (ej. fallo de base de datos)
    logger_1.logger.error('Error no controlado', err);
    return res.status(500).json({
        status: 'error',
        message: 'Algo salió muy mal en el servidor',
    });
};
exports.errorHandler = errorHandler;
