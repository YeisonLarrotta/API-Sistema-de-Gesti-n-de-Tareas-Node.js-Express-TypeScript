type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const levelPriority: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const envLevel = (process.env.LOG_LEVEL as LogLevel | undefined) ?? 'info';
const currentLevel = levelPriority[envLevel] ?? levelPriority.info;
const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

const shouldLog = (level: LogLevel) => levelPriority[level] <= currentLevel;

const formatMessage = (level: LogLevel, message: string) => {
  // En producción, no incluir timestamp para reducir tamaño de logs
  if (isProd) {
    return `[${level.toUpperCase()}] ${message}`;
  }
  const timestamp = new Date().toISOString();
  return `${timestamp} [${level.toUpperCase()}] ${message}`;
};

// Sanitizar datos sensibles del meta
const sanitizeMeta = (meta: unknown): unknown => {
  if (!meta || typeof meta !== 'object') return meta;
  
  const sensitiveFields = ['password', 'token', 'secret', 'authorization', 'jwt'];
  const sanitized = { ...meta as Record<string, unknown> };
  
  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  }
  
  return sanitized;
};

export const logger = {
  error: (message: string, meta?: unknown) => {
    if (!shouldLog('error')) return;
    console.error(formatMessage('error', message), sanitizeMeta(meta) ?? '');
  },
  warn: (message: string, meta?: unknown) => {
    if (!shouldLog('warn')) return;
    console.warn(formatMessage('warn', message), sanitizeMeta(meta) ?? '');
  },
  info: (message: string, meta?: unknown) => {
    // En producción o test, limitar logs info
    if (isProd || isTest || !shouldLog('info')) return;
    console.info(formatMessage('info', message), sanitizeMeta(meta) ?? '');
  },
  debug: (message: string, meta?: unknown) => {
    // En producción o test, no mostrar debug
    if (isProd || isTest || !shouldLog('debug')) return;
    console.debug(formatMessage('debug', message), sanitizeMeta(meta) ?? '');
  },
};
