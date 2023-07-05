/* eslint-disable no-unused-vars */
import MUUID from "uuid-mongodb";
import { CartModel } from "./models/cart.model.js";
import { ProductModel } from "./models/product.model.js";

export class CartDaoMongo {
  constructor() {}

  async getAll(limit = 0) {
    return CartModel.find().populate("products.product").limit(limit).lean();
  }

  async getById(cartId) {
    return CartModel.findById(MUUID.from(cartId))
      .populate("products.product")
      .lean();
  }

  async getOneByFilter(filterQuery) {
    throw new Error("Not implemented yet.");
  }

  async addOne(cart) {
    const newCart = await CartModel.create(cart);

    return newCart;
  }

  async updateOne(cartId, fieldsToUpdate) {
    let result = null;
    const formattedFieldsToUpdate = fieldsToUpdate;

    if (fieldsToUpdate.products) {
      formattedFieldsToUpdate.products = this._validateAndFormatProducts(
        fieldsToUpdate.products
      );
    }

    try {
      result = CartModel.findOneAndUpdate(
        {
          _id: MUUID.from(cartId),
        },
        { ...formattedFieldsToUpdate }
      );
    } catch (error) {
      if (error.code) {
        throw error;
      }

      const e = new Error(`error`);
      e.code = "UNCAUGHT_EXCEPTION";

      throw e;
    }

    if (result) {
      const updatedCart = await CartModel.findById(MUUID.from(cartId));

      return updatedCart;
    }

    return null;
  }

  async _validateAndFormatProducts(products) {
    const formattedProducts = products.map((p) => {
      return { ...p, product: MUUID.from(p.product) };
    });
    for (const p of formattedProducts) {
      const foundProduct = await ProductModel.findById(p.product);

      if (!foundProduct) {
        const e = new Error(`Product ${p.product} not found.`);
        e.code = "NOT_FOUND";

        throw e;
      }
    }

    return formattedProducts;
  }

  async deleteOne(objectId) {
    throw new Error("Not implemented yet.");
  }
}
