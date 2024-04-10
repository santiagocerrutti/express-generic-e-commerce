import Ajv from "ajv";
import { CustomError, ERROR_CODE } from "../../utils.js";
import { Types } from "mongoose";

/**
 * Middleware
 * Calls next(CustomError) in case validation fails
 */
export function validateCartId(req, res, next) {
  const { cid } = req.params;
  try {
    if (Types.ObjectId.isValid(cid)) {
      next();

      return;
    }

    const err = new CustomError(
      `Invalid ObjectId: ${cid}`,
      ERROR_CODE.INVALID_BODY
    );
    next(err);
  } catch (error) {
    const err = new CustomError(
      `Invalid ObjectId: ${cid}`,
      ERROR_CODE.INVALID_BODY
    );
    next(err);
  }
}

/**
 * Middleware
 * Calls next(CustomError) in case validation fails
 */
export function validateProductsOfCart(req, res, next) {
  const schema = {
    type: "object",
    properties: {
      products: {
        type: "array",
        items: {
          type: "object",
          properties: {
            product: {
              type: "string",
              pattern:
                "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
            },
            quantity: {
              type: "integer",
              minimum: 1,
            },
          },
          required: ["product", "quantity"],
        },
        minItems: 0,
      },
    },
    required: ["products"],
    additionalProperties: false,
  };
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(req.body)) {
    next();

    return;
  }

  const error = new CustomError(
    "Invalid products array.",
    ERROR_CODE.INVALID_BODY,
    validate.errors
  );
  next(error);
}

/**
 * Middleware
 * Calls next(CustomError) in case validation fails
 */
export function validateProductQuantity(req, res, next) {
  const schema = {
    type: "object",
    properties: {
      quantity: {
        type: "integer",
        minimum: 0,
      },
    },
    required: ["quantity"],
    additionalProperties: false,
  };
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(req.body)) {
    next();

    return;
  }

  const error = new CustomError(
    "Invalid products array.",
    ERROR_CODE.INVALID_BODY,
    validate.errors
  );
  next(error);
}
