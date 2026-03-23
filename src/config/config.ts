import dotenv from 'dotenv';

// Cargamos el .env
dotenv.config();

class Config {
  private static instance: Config;
  public readonly PORT: number;
  public readonly JWT_SECRET: string;
  public readonly DB_URL: string;

  private constructor() {
    this.PORT = Number(process.env.PORT) || 3000;
    this.JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
    // Aquí es donde lee la línea del .env que acabamos de corregir
    this.DB_URL = process.env.DATABASE_URL || ''; 
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}

export const config = Config.getInstance();