"use strict";

import { StatusCodes, ReasonPhrases } from "../utils/httpStatusCode.js";

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409,
};

const ReasonStatusCode = {
    FORBIDDEN: "Bad request error",
    CONFLICT: "Conflict error",
};

class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.status = statusCode;
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(
        message = ReasonStatusCode.CONFLICT,
        statusCode = StatusCode.CONFLICT
    ) {
        super(message, statusCode);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(
        message = ReasonStatusCode.CONFLICT,
        statusCode = StatusCode.FORBIDDEN
    ) {
        super(message, statusCode);
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.UNAUTHORIZED,
        statusCode = StatusCodes.UNAUTHORIZED
    ) {
        super(message, statusCode);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.NOT_FOUND,
        statusCode = StatusCodes.NOT_FOUND
    ) {
        super(message, statusCode);
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.FORBIDDEN,
        statusCode = StatusCodes.FORBIDDEN
    ) {
        super(message, statusCode);
    }
}

// Error redis
class RedisErrorResponse extends ErrorResponse {
    constructor(
        message = ReasonPhrases.INTERNAL_SERVER_ERROR,
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    ) {
        super(message, statusCode);
    }
}

export {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError,
    RedisErrorResponse,
};
