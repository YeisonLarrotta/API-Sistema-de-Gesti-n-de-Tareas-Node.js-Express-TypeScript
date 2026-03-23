import { NextFunction, Request, Response } from 'express';
import { AnySchema, ValidateFunction } from 'ajv';
import { ajv } from '../validations/ajv';
import { ValidationError } from '../utils/customErrors';

type RequestPart = 'body' | 'params' | 'query';

export const validate =
  (schema: AnySchema, part: RequestPart = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const validator: ValidateFunction = ajv.compile(schema);
    const valid = validator(req[part]);

    if (!valid) {
      const errors = (validator.errors ?? [])
        .map((error) => `${error.instancePath || '/'} ${error.message}`)
        .join('; ');

      return next(new ValidationError(`Error de validacion: ${errors}`));
    }

    next();
  };
