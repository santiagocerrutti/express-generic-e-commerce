/* eslint-disable no-unused-vars */
import fs from "node:fs";
import { v4 as uuidv4 } from "uuid";
import { ProductDaoFile } from "./product.dao.file.js";
import { CustomError, ERROR_CODE } from "../../utils.js";

const PATH = "./data/carts.json";

export class CartDaoFile {
  constructor() {
    this.path = PATH;
    this.carts = [];
  }

  async _retreiveCarts() {
    const content = await fs.promises.readFile(this.path);
    const carts = JSON.parse(content);

    return carts;
  }

  async _saveCarts(carts) {
    const content = JSON.stringify(carts);
    fs.promises.writeFile(this.path, content);
  }

  async getAll(limit = 0) {
    this.carts = await this._retreiveCarts();

    if (limit) {
      return this.carts.slice(0, limit);
    }

    return this.carts;
  }

  async getById(cartId) {
    this.carts = await this._retreiveCarts();
    const cart = this.carts.find((p) => p.id == cartId);

    if (cart) {
      return cart;
    }

    throw new CustomError(`Cart ${cartId} not found.`, ERROR_CODE.NOT_FOUND);
  }
  async getOneByFilter(filterQuery) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async addOne(cart) {
    this.carts = await this._retreiveCarts();
    const newCart = {
      id: uuidv4(),
      ...cart,
    };
    this.carts.push(newCart);
    await this._saveCarts(this.carts);

    return newCart;
  }

  // // async addProductToCart(cartId, productId, quantity) {
  // //   const cart = await this.getCartById(cartId);
  // //   const productManager = new ProductDaoFile();
  // //   await productManager.getProductById(productId);

  // //   const cartProduct = cart.products.find((p) => p.product === productId);

  // //   if (cartProduct) {
  // //     cartProduct.quantity += quantity;
  // //   } else {
  // //     cart.products.push({
  // //       product: productId,
  // //       quantity,
  // //     });
  // //   }

  // //   await this._saveCarts(this.carts);

  // //   return cartProduct;
  // // }

  async addMany(arrayOfObjects) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async updateOne(cartId, products) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async deleteOne(objectId) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }
}
