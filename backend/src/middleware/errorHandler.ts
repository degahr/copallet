import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    (Error as any).captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';
  let isOperational = false;

  // Zod validation errors
  if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    isOperational = true;
    
    logger.warn('Validation error:', {
      path: req.path,
      method: req.method,
      errors: error.errors,
    });
  }
  // Custom application errors
  else if (error instanceof CustomError) {
    statusCode = error.statusCode || 500;
    message = error.message;
    isOperational = error.isOperational || false;
  }
  // JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    isOperational = true;
  }
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    isOperational = true;
  }
  // Database errors
  else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Database validation error';
    isOperational = true;
  }
  else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
    isOperational = true;
  }
  // Duplicate key errors
  else if (error.message.includes('duplicate key')) {
    statusCode = 409;
    message = 'Resource already exists';
    isOperational = true;
  }
  // Foreign key constraint errors
  else if (error.message.includes('foreign key constraint')) {
    statusCode = 400;
    message = 'Referenced resource does not exist';
    isOperational = true;
  }

  // Log error details
  logger.error('Error occurred:', {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      user: req.user,
    },
    statusCode,
    isOperational,
  });

  // Send error response
  const errorResponse: any = {
    error: message,
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  // Include validation errors for Zod
  if (error instanceof ZodError) {
    errorResponse.details = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
    }));
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
  }

  res.status(statusCode).json(errorResponse);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};
