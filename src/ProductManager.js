import fs from "node:fs";

export class ProductManager {
  constructor(path) {
    this.path = path;
    this.lastProductId = 1;
  }

  async retreiveProducts() {
    const content = await fs.promises.readFile(this.path);
    const products = JSON.parse(content);
    this.lastProductId = products.length ? products.length + 1 : 1;
    return products;
  }

  async saveProducts(products) {
    const content = JSON.stringify(products);
    fs.promises.writeFile(this.path, content);
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

  async addProduct(product) {
    this.products = await this.retreiveProducts();
    if (
      this.isProductValid(product) &&
      !this.products.some((p) => p.code === product.code)
    ) {
      this.products.push({
        ...product,
        id: this.lastProductId,
      });
      this.saveProducts(this.products);
      this.lastProductId += 1;
    } else if (this.products.some((p) => p.code === product.code)) {
      console.error(`Code ${product.code} duplicated`);
    } else {
      console.error(`Invalid product: ${product}.`);
    }
  }

  async getProducts() {
    this.products = await this.retreiveProducts();
    return this.products;
  }

  async getProductById(productId) {
    this.products = await this.retreiveProducts();
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      return product;
    }
    console.error("Product " + productId + " not found.");
    return null;
  }
}
