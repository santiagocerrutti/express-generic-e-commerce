import MUUID from "uuid-mongodb";
import { CartModel } from "./models/cart.model.js";
import { ProductModel } from "./models/product.model.js";

export class CartManager {
  constructor() {}

  async addCart() {
    const newCart = await CartModel.create({});

    return newCart;
  }

  async getCarts(limit = 0) {
    return CartModel.find().limit(limit);
  }

  async getCartById(cartId) {
    const cart = await CartModel.findById(MUUID.from(cartId));

    if (cart) {
      return cart;
    }

    const error = new Error(`Cart ${cartId} not found.`);
    error.code = "NOT_FOUND";

    throw error;
  }

  async addProductToCart(cartId, productId, quantity) {
    const [cartUUID, productUUID] = [MUUID.from(cartId), MUUID.from(productId)];
    const cart = await CartModel.findById(cartUUID);

    if (!cart) {
      const error = new Error(`Cart ${cartId} not found.`);
      error.code = "NOT_FOUND";

      throw error;
    }

    const product = await ProductModel.findById(productUUID);

    if (!product) {
      const error = new Error(`Product ${productId} not found.`);
      error.code = "NOT_FOUND";

      throw error;
    }

    const cartProduct = cart.products.find(
      (p) => p.product.toString() === productId.toString()
    );

    if (cartProduct) {
      cartProduct.quantity += quantity;
    } else {
      cart.products.push({
        product: productUUID,
        quantity,
      });
    }

    await cart.save();

    return cart;
  }
}
