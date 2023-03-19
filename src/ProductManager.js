export class ProductManager {
  constructor() {
    this.products = [];
    this.lastProductId = 1;
  }

  isProductValid(product) {
    return (
      product.title &&
      product.description &&
      product.price &&
      product.thumbnail &&
      product.code &&
      product.stock
    );
  }

  addProduct(product) {
    if (
      this.isProductValid(product) &&
      !this.products.includes((p) => p.code === product.code)
    ) {
      this.products.push({
        ...product,
        id: this.lastProductId,
      });
      this.lastProductId = +1;
    }
  }

  getProducts() {
    return this.products;
  }

  getProductById(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      return product;
    }
    console.error("Product " + productId + " not found.");
    return null;
  }
}
