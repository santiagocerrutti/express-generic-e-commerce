import fs from "node:fs";
import { v4 as uuidv4 } from "uuid";
import { ProductManager } from "./product.manager.js";

const PATH = "./data/carts.json";

export class CartManager {
  constructor() {
    this.path = PATH;
    this.carts = [];
  }

  async retreiveCarts() {
    const content = await fs.promises.readFile(this.path);
    const carts = JSON.parse(content);

    return carts;
  }

  async saveCarts(carts) {
    const content = JSON.stringify(carts);
    fs.promises.writeFile(this.path, content);
  }

  async addCart() {
    this.carts = await this.retreiveCarts();
    const newCart = {
      products: [],
      id: uuidv4(),
    };
    this.carts.push(newCart);
    await this.saveCarts(this.carts);

    return newCart;
  }

  async getCarts(limit = 0) {
    this.carts = await this.retreiveCarts();

    if (limit) {
      return this.carts.slice(0, limit);
    }

    return this.carts;
  }

  async getCartById(cartId) {
    this.carts = await this.retreiveCarts();
    const cart = this.carts.find((p) => p.id == cartId);

    if (cart) {
      return cart;
    }

    const error = new Error(`Cart ${cartId} not found.`);
    error.code = "NOT_FOUND";

    throw error;
  }

  async addProductToCart(cartId, productId, quantity) {
    const cart = await this.getCartById(cartId);
    const productManager = new ProductManager();
    await productManager.getProductById(productId);

    const cartProduct = cart.products.find((p) => p.product === productId);

    if (cartProduct) {
      cartProduct.quantity += quantity;
    } else {
      cart.products.push({
        product: productId,
        quantity,
      });
    }

    await this.saveCarts(this.carts);

    return cartProduct;
  }
}
