import Ajv from "ajv";
import addFormats from "ajv-formats";
import { inspect } from "util";
import { CustomError, ERROR_CODE } from "../../utils.js";

// TODO: Documentar mejor
/**
 * Middleware
 * Calls next(CustomError) in case validation fails
 */
export function validateRegister(req, res, next) {
  const schema = {
    type: "object",
    properties: {
      first_name: { type: "string" },
      last_name: { type: "string" },
      email: {
        type: "string",
        format: "email",
      },
      date_of_birth: {
        type: "string",
        format: "date",
      },
      password: { type: "string" },
    },
    required: ["first_name", "last_name", "email", "date_of_birth", "password"],
    additionalProperties: false,
  };
  const ajv = new Ajv();
  addFormats(ajv);
  const validate = ajv.compile(schema);

  if (validate(req.body)) {
    next();

    return;
  }

  const error = new CustomError(
    `Invalid user: ${inspect(req.body)}.`,
    ERROR_CODE.INVALID_BODY,
    validate.errors
  );
  next(error);
}

// TODO: Documentar mejor
/**
 * Middleware
 * Calls next(CustomError) in case validation fails
 */
export function validateLogin(req, res, next) {
  const schema = {
    type: "object",
    properties: {
      email: {
        type: "string",
        format: "email",
      },
      password: { type: "string" },
    },
    required: ["email", "password"],
    additionalProperties: false,
  };
  const ajv = new Ajv();
  addFormats(ajv);
  const validate = ajv.compile(schema);

  if (validate(req.body)) {
    next();

    return;
  }

  const error = new CustomError(
    `Invalid login payload: ${inspect(req.body)}.`,
    ERROR_CODE.INVALID_BODY,
    validate.errors
  );
  next(error);
}

/**
 * Middleware
 * Calls next(CustomError) in case validation fails
 */
export function validateEmail(req, res, next) {
  const schema = {
    type: "object",
    properties: {
      email: {
        type: "string",
        format: "email",
      },
    },
    required: ["email"],
    additionalProperties: false,
  };
  const ajv = new Ajv();
  addFormats(ajv);
  const validate = ajv.compile(schema);

  if (validate(req.body)) {
    next();

    return;
  }

  const error = new CustomError(
    `Invalid reset password payload: ${inspect(req.body)}.`,
    ERROR_CODE.INVALID_BODY,
    validate.errors
  );
  next(error);
}

/**
 * Middleware
 * Calls next(CustomError) in case validation fails
 */
export function validatePassword(req, res, next) {
  const schema = {
    type: "object",
    properties: {
      password: { type: "string" },
    },
    required: ["password"],
  };
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(req.body)) {
    next();

    return;
  }

  const error = new CustomError(
    `Invalid new password payload: ${inspect(req.body)}.`,
    ERROR_CODE.INVALID_BODY,
    validate.errors
  );
  next(error);
}

/**
 * Middleware
 * Calls next(CustomError) in case validation fails
 */
export function validateUserId(req, res, next) {
  const { uid } = req.params;
  try {
    // TODO: validar el object ID
    if (uid) {
      next();

      return;
    }
  } catch (error) {
    const err = new CustomError(
      `Invalid UUID: ${uid}`,
      ERROR_CODE.INVALID_BODY
    );
    next(err);
  }
}

/** This is not a middleware */
export function validateUserDocumentPayload(req) {
  const schema = {
    type: "object",
    properties: {
      name: { type: "string" },
      document_type: {
        enum: ["identification", "account_statement", "proof_of_address"],
      },
    },
    required: ["document_type"],
  };
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(req.body)) {
    return;
  }

  throw new CustomError(
    `Invalid document payload: ${inspect(req.body)}.`,
    ERROR_CODE.INVALID_BODY,
    validate.errors
  );
}

export function validateUserDocumentFile(req, res, next) {
  if (req.file) {
    next();

    return;
  }

  next(new CustomError(`Invalid document file`, ERROR_CODE.INVALID_BODY));
}
