import { Pool } from 'pg';
import { config } from '../config/config';
import { logger } from '../utils/logger';

// Pool de conexiones reutilizable para PostgreSQL.
export const pool = new Pool({
  connectionString: config.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on('error', (err) => {
  logger.error('Error inesperado en la base de datos', err);
});

if (process.env.NODE_ENV !== 'test') {
  pool.query('SELECT NOW()', (err) => {
    if (err) {
      logger.error('Error conectando a PostgreSQL', err.message);
    }
  });
}