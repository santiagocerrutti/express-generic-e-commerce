import Ajv from "ajv";
import MUUID from "uuid-mongodb";

export function validateCartId(req, res, next) {
  const { cid } = req.params;
  try {
    MUUID.from(cid);
    next();

    return;
  } catch (error) {
    res.status(400).send({ status: "ERROR", error: `Invalid UUID: ${cid}` });
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

  res.status(400).send({
    status: "ERROR",
    error: "Invalid products array.",
    errors: validate.errors,
  });
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

  res.status(400).send({
    status: "ERROR",
    error: "Invalid product quantity.",
    errors: validate.errors,
  });
}
