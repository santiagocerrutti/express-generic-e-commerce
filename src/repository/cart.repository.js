/* eslint-disable no-unused-vars */

export class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async addCart() {
    return this.dao.addCart();
  }

  async getCarts(limit = 0) {
    return this.dao.getCarts(limit);
  }

  async getCartById(cartId) {
    return this.dao.getCartById(cartId);
  }

  async getCartByIdJson(cartId) {
    return this.dao.getCartByIdJson(cartId);
  }

  async addProductToCart(cartId, productId, quantity) {
    return this.dao.addProductToCart(cartId, productId, quantity);
  }

  async setProductsToCart(cartId, products) {
    return this.dao.setProductsToCart(cartId, products);
  }

  async deleteProductsOfCart(cartId) {
    return this.dao.deleteProductsOfCart(cartId);
  }

  async updateProductOfCart(cartId, productId, quantity) {
    return this.dao.updateProductOfCart(cartId, productId, quantity);
  }

  async deleteProductOfCart(cartId, productId) {
    return this.dao.deleteProductOfCart(cartId, productId);
  }
}
