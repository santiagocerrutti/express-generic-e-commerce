import Ajv from "ajv";
import MUUID from "uuid-mongodb";
import { CustomError, ERROR_CODE } from "../../utils.js";

export function validateCartId(req, res, next) {
  const { cid } = req.params;
  try {
    MUUID.from(cid);
    next();

    return;
  } catch (error) {
    const err = new CustomError(
      `Invalid UUID: ${cid}`,
      ERROR_CODE.INVALID_BODY
    );
    next(err);
  }
}

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
