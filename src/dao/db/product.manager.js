import MUUID from "uuid-mongodb";
import { ProductModel } from "./models/product.model.js";

export class ProductManager {
  constructor() {}

  async getProducts(limit = null) {
    return ProductModel.find().limit(limit);
  }

  async getProductsJson(limit = null) {
    return ProductModel.find().limit(limit).lean();
  }

  async getProductById(productId) {
    const product = await ProductModel.findById(MUUID.from(productId));

    if (product) {
      return product;
    }

    const error = new Error(`Product ${productId} not found.`);
    error.code = "NOT_FOUND";

    throw error;
  }

  async addProduct(product) {
    try {
      const newProduct = await ProductModel.create({ ...product });

      return newProduct;
    } catch (error) {
      const e = new Error(`Code ${product.code} duplicated`);
      e.code = "DUPLICATED_KEY";

      throw e;
    }
  }

  async updateProduct(productId, fieldsToUpdate) {
    let result = null;
    try {
      result = await ProductModel.findOneAndUpdate(
        {
          _id: MUUID.from(productId),
        },
        { ...fieldsToUpdate }
      );
    } catch (error) {
      const e = new Error(`Code ${fieldsToUpdate.code} duplicated`);
      e.code = "DUPLICATED_KEY";

      throw e;
    }

    if (result) {
      const updatedProduct = await ProductModel.findById(MUUID.from(productId));

      return updatedProduct;
    }

    const e = new Error(`Product ${productId} not found.`);
    e.code = "NOT_FOUND";

    throw e;
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
