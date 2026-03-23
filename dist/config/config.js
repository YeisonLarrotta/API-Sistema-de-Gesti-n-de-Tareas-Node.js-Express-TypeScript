"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Cargamos el .env
dotenv_1.default.config();
class Config {
    constructor() {
        this.PORT = Number(process.env.PORT) || 3000;
        this.JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
        // Aquí es donde lee la línea del .env que acabamos de corregir
        this.DB_URL = process.env.DATABASE_URL || '';
    }
    static getInstance() {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }
}
exports.config = Config.getInstance();
