"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const config_1 = require("../config/config");
const logger_1 = require("../utils/logger");
// Creamos el Pool usando la URL de conexión de nuestro Singleton
exports.pool = new pg_1.Pool({
    connectionString: config_1.config.DB_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});
exports.pool.on('error', (err) => {
    logger_1.logger.error('Error inesperado en la base de datos', err);
});
if (process.env.NODE_ENV !== 'test') {
    exports.pool.query('SELECT NOW()', (err) => {
        if (err) {
            logger_1.logger.error('Error conectando a PostgreSQL', err.message);
        }
    });
}
