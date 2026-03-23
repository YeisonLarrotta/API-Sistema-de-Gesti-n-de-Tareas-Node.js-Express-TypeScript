"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const levelPriority = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};
const envLevel = process.env.LOG_LEVEL ?? 'info';
const currentLevel = levelPriority[envLevel] ?? levelPriority.info;
const isProd = process.env.NODE_ENV === 'production';
const shouldLog = (level) => levelPriority[level] <= currentLevel;
const formatMessage = (level, message) => {
    const timestamp = new Date().toISOString();
    return `${timestamp} [${level.toUpperCase()}] ${message}`;
};
exports.logger = {
    error: (message, meta) => {
        if (!shouldLog('error'))
            return;
        console.error(formatMessage('error', message), meta ?? '');
    },
    warn: (message, meta) => {
        if (!shouldLog('warn'))
            return;
        console.warn(formatMessage('warn', message), meta ?? '');
    },
    info: (message, meta) => {
        if (isProd || !shouldLog('info'))
            return;
        console.info(formatMessage('info', message), meta ?? '');
    },
    debug: (message, meta) => {
        if (isProd || !shouldLog('debug'))
            return;
        console.debug(formatMessage('debug', message), meta ?? '');
    },
};
