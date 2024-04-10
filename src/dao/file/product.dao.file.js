/* eslint-disable no-unused-vars */
import Ajv from "ajv";
import { Types } from "mongoose";
import fs from "node:fs";
import { CustomError, ERROR_CODE } from "../../utils.js";

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
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async getById(productId) {
    this.products = await this._retreiveProducts();
    const product = this.products.find((p) => p.id == productId);

    if (product) {
      return product;
    }

    throw new CustomError(
      `Product ${productId} not found.`,
      ERROR_CODE.NOT_FOUND
    );
  }

  async getOneByFilter(filterQuery) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
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
        id: new Types.ObjectId(),
      };
      this.products.push(newProduct);
      await this._saveProducts(this.products);

      return newProduct;
    } else if (!validateResult.valid) {
      throw new CustomError(
        `Invalid product: ${JSON.stringify(product)}.`,
        ERROR_CODE.INVALID_BODY,
        validateResult.errors
      );
    } else {
      throw new CustomError(
        `Code ${product.code} duplicated`,
        ERROR_CODE.DUPLICATED_KEY
      );
    }
  }

  async addMany(arrayOfObjects) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
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
        throw new CustomError(
          `Code ${fieldsToUpdate.code} duplicated`,
          ERROR_CODE.DUPLICATED_KEY
        );
      }
    } else if (!validateResult.valid) {
      throw new CustomError(
        `Fields to update not valid: ${JSON.stringify(fieldsToUpdate)}.`,
        ERROR_CODE.INVALID_BODY,
        validateResult.errors
      );
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
