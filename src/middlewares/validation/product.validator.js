import Ajv from "ajv";
import { inspect } from "util";
import MUUID from "uuid-mongodb";

export function validateProductId(req, res, next) {
  const { pid } = req.params;
  try {
    MUUID.from(pid);
    next();

    return;
  } catch (error) {
    res.status(400).send({ status: "ERROR", error: `Invalid UUID: ${pid}` });
  }
}

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

  res.status(400).send({
    status: "ERROR",
    error: `Invalid query params.`,
    errors: validate.errors,
  });
}

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

  res.status(400).send({
    status: "ERROR",
    error: `Invalid product: ${inspect(req.body)}.`,
    errors: validate.errors,
  });
}

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

  res.status(400).send({
    status: "ERROR",
    error: `Invalid product: ${inspect(req.body)}.`,
    errors: validate.errors,
  });
}
