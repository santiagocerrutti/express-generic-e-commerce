/* eslint-disable no-unused-vars */
import Ajv from "ajv";
import fs from "node:fs";
import { v4 as uuidv4 } from "uuid";

const PATH = "./data/products.json";
export class ProductDaoFile {
  constructor() {
    this.path = PATH;
    this.products = [];
  }

  async _retreiveProducts() {
    const content = await fs.promises.readFile(this.path);
    const products = JSON.parse(content);

    return products;
  }

  async _saveProducts(products) {
    const content = JSON.stringify(products);
    fs.promises.writeFile(this.path, content);
  }

  _validateAddProduct(product) {
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

  async getAll(limit = 0) {
    this.products = await this._retreiveProducts();

    if (limit) {
      return this.products.slice(0, limit);
    }

    return this.products;
  }

  async getAllPaginate(limit = 10, page = 1, query = {}, sort = undefined) {
    throw new Error("Not implemented yet.");
  }

  async getById(productId) {
    this.products = await this._retreiveProducts();
    const product = this.products.find((p) => p.id == productId);

    if (product) {
      return product;
    }

    const error = new Error(`Product ${productId} not found.`);
    error.code = "NOT_FOUND";

    throw error;
  }

  async getOneByFilter(filterQuery) {
    throw new Error("Not implemented yet.");
  }

  async addOne(product) {
    this.products = await this._retreiveProducts();
    const validateResult = this._validateAddProduct(product);

    if (
      validateResult.valid &&
      !this.products.some((p) => p.code === product.code)
    ) {
      const newProduct = {
        ...product,
        id: uuidv4(),
      };
      this.products.push(newProduct);
      await this._saveProducts(this.products);

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

  _validateUpdateProduct(product) {
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

  async updateOne(productId, fieldsToUpdate) {
    const productToUpdate = await this.getProductById(productId);
    const validateResult = this._validateUpdateProduct(fieldsToUpdate);

    if (validateResult.valid && productToUpdate) {
      if (
        !fieldsToUpdate.code ||
        !this.products.some((p) => p.code === fieldsToUpdate.code)
      ) {
        const index = this.products.findIndex((p) => p.id === productId);
        this.products[index] = { ...productToUpdate, ...fieldsToUpdate };

        await this._saveProducts(this.products);

        return this.products[index];
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

  async deleteOne(productId) {
    const productToDelete = await this.getProductById(productId);

    if (productToDelete) {
      const products = this.products.filter((p) => p.id !== productId);
      await this._saveProducts(products);

      return productToDelete;
    }

    return null;
  }
}
