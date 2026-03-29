import { Pool, PoolConfig } from 'pg';
import { config } from '../config/config';
import { logger } from '../utils/logger';

const poolConfig: PoolConfig = {
  connectionString: config.DB_URL,
  ssl: config.isProduction() 
    ? { rejectUnauthorized: false }
    : undefined,
  // Configuración de pool para producción
  max: config.isProduction() ? 20 : 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Pool de conexiones reutilizable para PostgreSQL.
export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  logger.error('Error inesperado en la base de datos', err);
});

pool.on('connect', () => {
  if (!config.isProduction()) {
    logger.debug('Nueva conexión a PostgreSQL establecida');
  }
});

// Verificar conexión solo en desarrollo/producción, no en test
if (!config.isTest()) {
  pool.query('SELECT NOW()')
    .then(() => {
      logger.info('Conexión a PostgreSQL exitosa');
    })
    .catch((err) => {
      logger.error('Error conectando a PostgreSQL', err.message);
      // En producción, salir si no hay conexión a BD
      if (config.isProduction()) {
        process.exit(1);
      }
    });
}