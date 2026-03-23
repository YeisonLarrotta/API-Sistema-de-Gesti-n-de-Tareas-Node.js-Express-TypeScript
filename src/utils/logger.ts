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

const shouldLog = (level: LogLevel) => levelPriority[level] <= currentLevel;

const formatMessage = (level: LogLevel, message: string) => {
  const timestamp = new Date().toISOString();
  return `${timestamp} [${level.toUpperCase()}] ${message}`;
};

export const logger = {
  error: (message: string, meta?: unknown) => {
    if (!shouldLog('error')) return;
    console.error(formatMessage('error', message), meta ?? '');
  },
  warn: (message: string, meta?: unknown) => {
    if (!shouldLog('warn')) return;
    console.warn(formatMessage('warn', message), meta ?? '');
  },
  info: (message: string, meta?: unknown) => {
    if (isProd || !shouldLog('info')) return;
    console.info(formatMessage('info', message), meta ?? '');
  },
  debug: (message: string, meta?: unknown) => {
    if (isProd || !shouldLog('debug')) return;
    console.debug(formatMessage('debug', message), meta ?? '');
  },
};
