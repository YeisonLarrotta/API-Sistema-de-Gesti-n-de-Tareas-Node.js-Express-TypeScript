import dotenv from 'dotenv';
import { logger } from '../utils/logger';

// Inicializa variables de entorno al arrancar la aplicacion.
dotenv.config();

/**
 * Variables de entorno requeridas para la aplicacion.
 */
const REQUIRED_ENV_VARS = ['JWT_SECRET', 'DATABASE_URL'] as const;

type RequiredEnvVar = typeof REQUIRED_ENV_VARS[number];

/**
 * Valida que todas las variables de entorno requeridas esten presentes.
 * Lanza error si falta alguna en produccion.
 */
function validateEnvVars(): void {
  const missingVars: string[] = [];
  
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    const errorMessage = `Variables de entorno faltantes: ${missingVars.join(', ')}`;
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(errorMessage);
    }
    
    logger.warn(errorMessage);
  }
}

class Config {
  private static instance: Config;
  public readonly PORT: number;
  public readonly JWT_SECRET: string;
  public readonly DB_URL: string;
  public readonly NODE_ENV: string;
  public readonly LOG_LEVEL: string;

  private constructor() {
    validateEnvVars();
    
    this.PORT = Number(process.env.PORT) || 3000;
    this.JWT_SECRET = process.env.JWT_SECRET || '';
    this.DB_URL = process.env.DATABASE_URL || '';
    this.NODE_ENV = process.env.NODE_ENV || 'development';
    this.LOG_LEVEL = process.env.LOG_LEVEL || 'info';

    // Validacion adicional en produccion
    if (this.NODE_ENV === 'production') {
      if (!this.JWT_SECRET || this.JWT_SECRET.length < 32) {
        throw new Error('JWT_SECRET debe tener al menos 32 caracteres en produccion');
      }
      
      if (!this.DB_URL) {
        throw new Error('DATABASE_URL es requerida en produccion');
      }
    }
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  /**
   * Verifica si estamos en ambiente de desarrollo.
   */
  public isDevelopment(): boolean {
    return this.NODE_ENV === 'development';
  }

  /**
   * Verifica si estamos en ambiente de produccion.
   */
  public isProduction(): boolean {
    return this.NODE_ENV === 'production';
  }

  /**
   * Verifica si estamos en ambiente de pruebas.
   */
  public isTest(): boolean {
    return this.NODE_ENV === 'test';
  }
}

export const config = Config.getInstance();