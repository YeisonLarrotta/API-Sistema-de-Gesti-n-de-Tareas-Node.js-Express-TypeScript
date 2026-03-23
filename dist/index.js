"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config/config");
const app_1 = __importDefault(require("./app"));
// Iniciamos el servidor usando el puerto definido en nuestro Singleton de Configuración
const PORT = config_1.config.PORT;
app_1.default.listen(PORT, () => {
});
