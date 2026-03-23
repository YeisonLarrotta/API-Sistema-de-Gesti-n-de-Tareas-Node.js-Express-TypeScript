"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const task_schemas_1 = require("../validations/task.schemas");
const router = (0, express_1.Router)();
// Todas estas rutas están protegidas
router.post('/', auth_middleware_1.authenticateToken, (0, validate_middleware_1.validate)(task_schemas_1.createTaskSchema), task_controller_1.createTask);
router.get('/', auth_middleware_1.authenticateToken, task_controller_1.getTasks);
router.get('/:id', auth_middleware_1.authenticateToken, (0, validate_middleware_1.validate)(task_schemas_1.taskIdParamSchema, 'params'), task_controller_1.getTaskById);
router.put('/:id', auth_middleware_1.authenticateToken, (0, validate_middleware_1.validate)(task_schemas_1.taskIdParamSchema, 'params'), (0, validate_middleware_1.validate)(task_schemas_1.updateTaskSchema), task_controller_1.updateTask);
router.delete('/:id', auth_middleware_1.authenticateToken, (0, validate_middleware_1.validate)(task_schemas_1.taskIdParamSchema, 'params'), task_controller_1.deleteTask);
router.patch('/:id/complete', auth_middleware_1.authenticateToken, (0, validate_middleware_1.validate)(task_schemas_1.taskIdParamSchema, 'params'), task_controller_1.completeTask);
exports.default = router;
