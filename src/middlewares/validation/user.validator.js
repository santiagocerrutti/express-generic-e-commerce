import Ajv from "ajv";
import addFormats from "ajv-formats";
import { inspect } from "util";

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

  res.sendBadRequest(`Invalid user: ${inspect(req.body)}.`, validate.errors);
}

export function validateLogin(req, res, next) {
  const schema = {
    type: "object",
    properties: {
      email: { type: "string" },
      password: { type: "string" },
    },
    required: ["email", "password"],
    additionalProperties: false,
  };
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(req.body)) {
    next();

    return;
  }

  res.sendBadRequest(
    `Invalid login payload: ${inspect(req.body)}.`,
    validate.errors
  );
}
