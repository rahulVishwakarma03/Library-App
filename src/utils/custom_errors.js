class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.success = false;
    this.status = statusCode;
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message) {
    super(message, 401);
  }
}

export class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
  }
}

export class ServerError extends AppError {
  constructor(message) {
    super(message, 500);
  }
}
