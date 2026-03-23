"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const errorHandler_1 = require("./middlewares/errorHandler");
const customErrors_1 = require("./utils/customErrors");
const auth_routes_1 = __importDefault(require("./api/auth.routes"));
const task_routes_1 = __importDefault(require("./api/task.routes"));
const swagger_1 = require("./docs/swagger");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.json({ status: 'UP', message: 'Servidor funcionando correctamente' });
});
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.use('/auth', auth_routes_1.default);
app.use('/tasks', task_routes_1.default);
app.use((req, res, next) => {
    next(new customErrors_1.NotFoundError(`La ruta ${req.originalUrl} no existe`));
});
app.use(errorHandler_1.errorHandler);
exports.default = app;
