"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const ajv_1 = require("../validations/ajv");
const customErrors_1 = require("../utils/customErrors");
const validate = (schema, part = 'body') => (req, res, next) => {
    const validator = ajv_1.ajv.compile(schema);
    const valid = validator(req[part]);
    if (!valid) {
        const errors = (validator.errors ?? [])
            .map((error) => `${error.instancePath || '/'} ${error.message}`)
            .join('; ');
        return next(new customErrors_1.ValidationError(`Error de validacion: ${errors}`));
    }
    next();
};
exports.validate = validate;
