import Ajv from "ajv";
import { inspect } from "util";
import MUUID from "uuid-mongodb";
import { CustomError, ERROR_CODE } from "../../utils.js";

/**
 * Middleware
 * Calls next(CustomError) in case validation fails
 */
export function validateProductId(req, res, next) {
  const { pid } = req.params;
  try {
    MUUID.from(pid);
    next();

    return;
  } catch (error) {
    const err = new CustomError(
      `Invalid UUID: ${pid}`,
      ERROR_CODE.INVALID_BODY
    );
    next(err);
  }
}

/**
 * Middleware
 * Calls next(CustomError) in case validation fails
 */
export function validateGetProductsQuery(req, res, next) {
  const schema = {
    type: "object",
    properties: {
      page: { type: "string", pattern: "^[0-9]*$" },
      limit: { type: "string", pattern: "^[0-9]*$" },
      query: { type: "string" },
      sort: { enum: ["desc", "asc"] },
    },
    required: [],
    additionalProperties: false,
  };
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(req.query)) {
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
export function validatePostProduct(req, res, next) {
  const schema = {
    type: "object",
    properties: {
      title: { type: "string" },
      description: { type: "string" },
      code: { type: "string" },
      price: { type: "number" },
      status: { type: "boolean" },
      stock: { type: "integer" },
      category: { type: "string" },
      thumbnails: { type: "array", items: { type: "string" } },
    },
    required: [
      "title",
      "description",
      "code",
      "price",
      "status",
      "stock",
      "category",
    ],
    additionalProperties: false,
  };
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(req.body)) {
    next();

    return;
  }

  const error = new CustomError(
    `Invalid product: ${inspect(req.body)}.`,
    ERROR_CODE.INVALID_BODY,
    validate.errors
  );
  next(error);
}

/**
 * Middleware
 * Calls next(CustomError) in case validation fails
 */
export function validatePutProduct(req, res, next) {
  const schema = {
    type: "object",
    properties: {
      title: { type: "string" },
      description: { type: "string" },
      code: { type: "string" },
      price: { type: "number" },
      status: { type: "boolean" },
      stock: { type: "integer" },
      category: { type: "string" },
      thumbnails: { type: "array", items: { type: "string" } },
    },
    additionalProperties: false,
  };
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(req.body)) {
    next();

    return;
  }

  const error = new CustomError(
    `Invalid product: ${inspect(req.body)}.`,
    ERROR_CODE.INVALID_BODY,
    validate.errors
  );
  next(error);
}
