import Ajv from "ajv";
import addFormats from "ajv-formats";
import { inspect } from "util";
import { CustomError, ERROR_CODE } from "../../utils.js";

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
