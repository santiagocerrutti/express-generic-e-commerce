import Ajv from "ajv";
import { ProductModel } from "../../models/product.model.js";

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
    this.products = await ProductModel.find().limit(limit);

    return this.products;
  }
}
