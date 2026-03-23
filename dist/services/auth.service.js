"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../persistence/db");
const config_1 = require("../config/config");
class AuthService {
    /**
     * Registra un usuario nuevo y devuelve datos publicos.
     */
    async register(nombre, email, password) {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const query = 'INSERT INTO users (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email';
        const values = [nombre, email, hashedPassword];
        const result = await db_1.pool.query(query, values);
        return result.rows[0];
    }
    /**
     * Valida email y password y devuelve token JWT + perfil basico.
     */
    async login(email, password) {
        // 1. Buscamos al usuario por su email
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await db_1.pool.query(query, [email]);
        const user = result.rows[0];
        // 2. Si no existe, lanzamos error
        if (!user) {
            throw new Error('Credenciales inválidas');
        }
        // 3. Comparamos la contraseña que envía Postman con la que está en la DB
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Credenciales inválidas');
        }
        // 4. Si todo está OK, creamos el Token JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, config_1.config.JWT_SECRET, { expiresIn: '2h' } // El token expira en 2 horas
        );
        // 5. Devolvemos el token y los datos básicos del usuario
        return {
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email
            }
        };
    }
}
exports.AuthService = AuthService;
