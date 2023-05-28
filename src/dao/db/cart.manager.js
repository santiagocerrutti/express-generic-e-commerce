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
    return CartModel.find().populate("products.product").limit(limit);
  }

  async getCartById(cartId) {
    const cart = await CartModel.findById(MUUID.from(cartId)).populate(
      "products.product"
    );

    if (cart) {
      return cart;
    }

    const error = new Error(`Cart ${cartId} not found.`);
    error.code = "NOT_FOUND";

    throw error;
  }

  async getCartByIdJson(cartId) {
    const cart = await CartModel.findById(MUUID.from(cartId))
      .populate("products.product")
      .lean();

    if (cart) {
      return cart;
    }

    const error = new Error(`Cart ${cartId} not found.`);
    error.code = "NOT_FOUND";

    throw error;
  }

  async addProductToCart(cartId, productId, quantity) {
    const { cartDocument, productUUID } = await this._getCartAndProductDocument(
      cartId,
      productId
    );

    const cartProduct = cartDocument.products.find(
      (p) => p.product.toString() === productId.toString()
    );

    if (cartProduct) {
      cartProduct.quantity += quantity;
    } else {
      cartDocument.products.push({
        product: productUUID,
        quantity,
      });
    }

    await cartDocument.save();

    return cartDocument;
  }

  async setProductsToCart(cartId, products) {
    let result = null;
    try {
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
      result = await CartModel.findOneAndUpdate(
        {
          _id: MUUID.from(cartId),
        },
        { products: formattedProducts }
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

    const e = new Error(`Cart ${cartId} not found.`);
    e.code = "NOT_FOUND";

    throw e;
  }

  async deleteProductsOfCart(cartId) {
    return this.setProductsToCart(cartId, []);
  }

  async updateProductOfCart(cartId, productId, quantity) {
    const { cartDocument } = await this._getCartAndProductDocument(
      cartId,
      productId
    );

    const cartProduct = cartDocument.products.find(
      (p) => p.product.toString() === productId.toString()
    );

    if (cartProduct) {
      if (quantity > 0) {
        cartProduct.quantity = quantity;
      } else {
        cartDocument.products = cartDocument.products.filter(
          (p) => p.product.toString() !== productId.toString()
        );
      }
    } else {
      const error = new Error(
        `Product ${productId} not included in cart ${cartId}.`
      );
      error.code = "NOT_FOUND";

      throw error;
    }

    await cartDocument.save();

    return cartDocument;
  }

  async deleteProductOfCart(cartId, productId) {
    const { cartDocument } = await this._getCartAndProductDocument(
      cartId,
      productId
    );

    const cartProduct = cartDocument.products.find(
      (p) => p.product.toString() === productId.toString()
    );

    if (cartProduct) {
      cartDocument.products = cartDocument.products.filter(
        (p) => p.product.toString() !== productId.toString()
      );
    } else {
      const error = new Error(
        `Product ${productId} not included in cart ${cartId}.`
      );
      error.code = "NOT_FOUND";

      throw error;
    }

    await cartDocument.save();

    return cartDocument;
  }

  async _getCartAndProductDocument(cartId, productId) {
    const [cartUUID, productUUID] = [MUUID.from(cartId), MUUID.from(productId)];
    const cartDocument = await CartModel.findById(cartUUID);

    if (!cartDocument) {
      const error = new Error(`Cart ${cartId} not found.`);
      error.code = "NOT_FOUND";

      throw error;
    }

    const productDocument = await ProductModel.findById(productUUID);

    if (!productDocument) {
      const error = new Error(`Product ${productId} not found.`);
      error.code = "NOT_FOUND";

      throw error;
    }

    return {
      cartUUID,
      productUUID,
      cartDocument,
      productDocument,
    };
  }
}
