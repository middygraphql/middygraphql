"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
test('should throw "BadRequestError"', () => {
    try {
        throw new index_1.BadRequestError("BadRequestError");
    }
    catch (error) {
        expect(error.extensions.code).toBe("BAD_REQUEST");
        expect(error.message).toBe("BadRequestError");
    }
});
test('should throw "ConflictError"', () => {
    try {
        throw new index_1.ConflictError("ConflictError");
    }
    catch (error) {
        expect(error.extensions.code).toBe("CONFLICT");
        expect(error.message).toBe("ConflictError");
    }
});
test('should throw "ForbiddenError"', () => {
    try {
        throw new index_1.ForbiddenError("ForbiddenError");
    }
    catch (error) {
        expect(error.extensions.code).toBe("FORBIDDEN");
        expect(error.message).toBe("ForbiddenError");
    }
});
test('should throw "InternalError"', () => {
    try {
        throw new index_1.InternalError("InternalError");
    }
    catch (error) {
        expect(error.extensions.code).toBe("INTERNAL_SERVER_ERROR");
        expect(error.message).toBe("InternalError");
    }
});
test('should throw "NotFoundError"', () => {
    try {
        throw new index_1.NotFoundError("NotFoundError");
    }
    catch (error) {
        expect(error.extensions.code).toBe("NOT_FOUND");
        expect(error.message).toBe("NotFoundError");
    }
});
test('should throw "PaymentRequiredError"', () => {
    try {
        throw new index_1.PaymentRequiredError("PaymentRequiredError");
    }
    catch (error) {
        expect(error.extensions.code).toBe("PAYMENT_REQUIRED");
        expect(error.message).toBe("PaymentRequiredError");
    }
});
test('should throw "TooManyRequestsError"', () => {
    try {
        throw new index_1.TooManyRequestsError("TooManyRequestsError");
    }
    catch (error) {
        expect(error.extensions.code).toBe("TOO_MANY_REQUESTS");
        expect(error.message).toBe("TooManyRequestsError");
    }
});
test('should throw "ValidationError"', () => {
    try {
        throw new index_1.ValidationError("ValidationError", {
            extensions: {
                details: [],
            },
        });
    }
    catch (error) {
        expect(error.extensions.code).toBe("VALIDATION_ERROR");
        expect(error.extensions.details).toStrictEqual([]);
        expect(error.message).toBe("ValidationError");
    }
});
