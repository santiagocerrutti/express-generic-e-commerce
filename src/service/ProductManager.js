import fs from "node:fs";
import Ajv from "ajv";
import { v4 as uuidv4 } from "uuid";

export class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async retreiveProducts() {
    const content = await fs.promises.readFile(this.path);
    const products = JSON.parse(content);

    return products;
  }

  async saveProducts(products) {
    const content = JSON.stringify(products);
    fs.promises.writeFile(this.path, content);
  }

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

  async addProduct(product) {
    console.log(product);
    this.products = await this.retreiveProducts();
    const validateResult = this.validateAddProduct(product);

    if (
      validateResult.valid &&
      !this.products.some((p) => p.code === product.code)
    ) {
      const newProduct = {
        ...product,
        id: uuidv4(),
      };
      this.products.push(newProduct);
      await this.saveProducts(this.products);

      return newProduct;
    } else if (!validateResult.valid) {
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

  async getProducts(limit = 0) {
    this.products = await this.retreiveProducts();

    if (limit) {
      return this.products.slice(0, limit);
    }

    return this.products;
  }

  async getProductById(productId) {
    this.products = await this.retreiveProducts();
    const product = this.products.find((p) => p.id == productId);

    if (product) {
      return product;
    }

    const error = new Error(`Product ${productId} not found.`);
    error.code = "NOT_FOUND";

    throw error;
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
    const productToUpdate = await this.getProductById(productId);
    const validateResult = this.validateUpdateProduct(fieldsToUpdate);

    if (validateResult.valid && productToUpdate) {
      if (
        !fieldsToUpdate.code ||
        !this.products.some((p) => p.code === fieldsToUpdate.code)
      ) {
        const index = this.products.findIndex((p) => p.id !== productId);
        this.products[index] = { ...productToUpdate, ...fieldsToUpdate };
        await this.saveProducts(this.products);

        return { ...productToUpdate, ...fieldsToUpdate };
      } else {
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
    }

    return null;
  }

  async deleteProduct(productId) {
    const productToDelete = await this.getProductById(productId);

    if (productToDelete) {
      const products = this.products.filter((p) => p.id !== productId);
      await this.saveProducts(products);

      return productToDelete;
    }

    return null;
  }
}
