import Ajv from "ajv";
import { ProductModel } from "./models/product.model.js";

import MUUID from "uuid-mongodb";
export class ProductManager {
  constructor() {}

  validateAddProduct(product) {
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

    return {
      valid: validate(product),
      errors: validate.errors,
    };
  }

  async getProducts(limit = null) {
    return ProductModel.find().limit(limit);
  }

  async getProductById(productId) {
    // TODO: Se debería validar el UUID con un Middleware y lanzar un badRequest
    const product = await ProductModel.findById(MUUID.from(productId));

    if (product) {
      return product;
    }

    const error = new Error(`Product ${productId} not found.`);
    error.code = "NOT_FOUND";

    throw error;
  }

  async addProduct(product) {
    const validateResult = this.validateAddProduct(product); // TODO: esto podria ser un middleware

    if (validateResult.valid) {
      const newProduct = await ProductModel.create({ ...product });

      return newProduct;
    } else if (!validateResult.valid) {
      // TODO: esto debería ser parte del middleware
      const error = new Error(`Invalid product: ${JSON.stringify(product)}.`);
      error.code = "INVALID_BODY";
      error.errors = validateResult.errors;

      throw error;
    } else {
      const error = new Error(`Code ${product.code} duplicated`);
      error.code = "DUPLICATED_KEY";

      throw error;
    }
  }

  validateUpdateProduct(product) {
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

    return {
      valid: validate(product),
      errors: validate.errors,
    };
  }

  async updateProduct(productId, fieldsToUpdate) {
    const productToUpdate = await ProductModel.findOne({
      _id: MUUID.from(productId),
    });
    const validateResult = this.validateUpdateProduct(fieldsToUpdate); // TODO: ESTO DEBERIA SER UN MIDDLEWARE

    if (validateResult.valid && productToUpdate) {
      try {
        await ProductModel.updateOne(
          {
            _id: MUUID.from(productId),
          },
          { ...fieldsToUpdate }
        );
        const result = await ProductModel.findById(MUUID.from(productId));

        return result;
      } catch (e) {
        const error = new Error(`Code ${fieldsToUpdate.code} duplicated`);
        error.code = "DUPLICATED_KEY";

        throw error;
      }
    } else if (!validateResult.valid) {
      const error = new Error(
        `Fields to update not valid: ${JSON.stringify(fieldsToUpdate)}.`
      );
      error.code = "INVALID_BODY";
      error.errors = validateResult.errors;

      throw error;
    } else {
      const error = new Error(`Product ${productId} not found.`);
      error.code = "NOT_FOUND";

      throw error;
    }
  }

  async deleteProduct(productId) {
    const result = await ProductModel.findOneAndDelete({
      _id: MUUID.from(productId),
    });

    if (result) {
      return result;
    }

    const error = new Error(`Product ${productId} not found.`);
    error.code = "NOT_FOUND";

    throw error;
  }
}
