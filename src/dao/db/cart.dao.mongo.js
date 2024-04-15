/* eslint-disable no-unused-vars */
import { CartModel } from "./models/cart.model.js";
import { ProductModel } from "./models/product.model.js";
import { CustomError, ERROR_CODE } from "../../utils.js";

export class CartDaoMongo {
  constructor() {}

  async getAll(limit = 0) {
    return CartModel.find().populate("products.product").limit(limit).lean();
  }

  async getAllByFilter(filterQuery) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async getById(cartId) {
    return CartModel.findById(cartId).populate("products.product").lean();
  }

  async getOneByFilter(filterQuery) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async addOne(cart) {
    const newCart = await CartModel.create({ ...cart });

    return newCart;
  }

  async addMany(arrayOfObjects) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async updateOne(cartId, fieldsToUpdate) {
    let result = null;
    const formattedFieldsToUpdate = fieldsToUpdate;

    if (fieldsToUpdate.products) {
      formattedFieldsToUpdate.products = await this._validateAndFormatProducts(
        fieldsToUpdate.products
      );
    }

    try {
      result = await CartModel.findOneAndUpdate(
        {
          _id: cartId,
        },
        { ...formattedFieldsToUpdate }
      );
    } catch (error) {
      if (error.code) {
        throw new CustomError(error.message, error.code);
      }

      throw new CustomError(error.message, ERROR_CODE.UNCAUGHT_EXCEPTION);
    }

    if (result) {
      const updatedCart = await CartModel.findById(cartId);

      return updatedCart;
    }

    return null;
  }

  async _validateAndFormatProducts(products) {
    const formattedProducts = products.map((p) => {
      return { ...p, product: p.product };
    });
    for (const p of formattedProducts) {
      // TODO: Habrá alguna forma mas eficiente de verificar si los ids existen en BD?
      const foundProduct = await ProductModel.findById(p.product);

      if (!foundProduct) {
        throw new CustomError(
          `Product ${p.product} not found.`,
          ERROR_CODE.NOT_FOUND
        );
      }
    }

    return formattedProducts;
  }

  async deleteOne(objectId) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }
}
