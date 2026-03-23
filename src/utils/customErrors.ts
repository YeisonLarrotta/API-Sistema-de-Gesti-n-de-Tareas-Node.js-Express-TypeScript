export class AppError extends Error {
    public readonly statusCode: number;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      Object.setPrototypeOf(this, new.target.prototype);
    }
  }
  
  export class NotFoundError extends AppError {
    constructor(message: string = 'Recurso no encontrado') {
      super(message, 404);
    }
  }
  
  export class AuthenticationError extends AppError {
    constructor(message: string = 'No autorizado') {
      super(message, 401);
    }
  }

export class ValidationError extends AppError {
  constructor(message: string = 'Datos de entrada invalidos') {
    super(message, 400);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Acceso prohibido') {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflicto en la operacion') {
    super(message, 409);
  }
}