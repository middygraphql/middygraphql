import { GraphQLError, GraphQLErrorOptions } from "graphql";

export class InternalError extends GraphQLError {
  constructor(message = "Internal server error.", options?: GraphQLErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        ...options?.extensions,
      },
    });
  }
}

export class ValidationError extends GraphQLError {
  constructor(
    message = "Validation error(s) present. See extensions for more details.",
    options?: GraphQLErrorOptions
  ) {
    super(message, {
      ...options,
      extensions: {
        code: "VALIDATION_ERROR",
        ...options?.extensions,
      },
    });
  }
}

export class ForbiddenError extends GraphQLError {
  constructor(message = "Forbidden", options?: GraphQLErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: "FORBIDDEN",
        ...options?.extensions,
      },
    });
  }
}

export class NotFoundError extends GraphQLError {
  constructor(message = "Not Found", options?: GraphQLErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: "NOT_FOUND",
        ...options?.extensions,
      },
    });
  }
}

export class BadRequestError extends GraphQLError {
  constructor(
    message = "There’s a problem. Review it then try again.",
    options?: GraphQLErrorOptions
  ) {
    super(message, {
      ...options,
      extensions: {
        code: "BAD_REQUEST",
        ...options?.extensions,
      },
    });
  }
}

export class TooManyRequestsError extends GraphQLError {
  constructor(message = "Too Many Requests", options?: GraphQLErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: "TOO_MANY_REQUESTS",
        ...options?.extensions,
      },
    });
  }
}

export class ConflictError extends GraphQLError {
  constructor(message = "Conflict Request", options?: GraphQLErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: "CONFLICT",
        ...options?.extensions,
      },
    });
  }
}

export class PaymentRequiredError extends GraphQLError {
  constructor(message = "Payment Required", options?: GraphQLErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: "PAYMENT_REQUIRED",
        ...options?.extensions,
      },
    });
  }
}
