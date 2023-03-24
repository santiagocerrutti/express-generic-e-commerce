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
      const newProduct = {
        ...product,
        id: this.lastProductId,
      };
      this.products.push(newProduct);
      await this.saveProducts(this.products);
      this.lastProductId += 1;
      return newProduct;
    } else if (this.products.some((p) => p.code === product.code)) {
      console.error(`Code ${product.code} duplicated`);
      return null;
    } else {
      console.error(`Invalid product: ${product}.`);
      return null;
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

  isUpdateValid(product) {
    // TODO: agregar una validación de tipos
    const productKeys = [
      "title",
      "description",
      "price",
      "thumbnail",
      "code",
      "stock",
    ];
    for (const key of Object.keys(product)) {
      if (!productKeys.includes(key)) {
        return false;
      }
    }
    return true;
  }

  async updateProduct(productId, fieldsToUpdate) {
    const productToUpdate = await this.getProductById(productId);
    if (this.isUpdateValid(fieldsToUpdate) && productToUpdate) {
      const products = this.products.filter((p) => p.id !== productId);
      products.push({ ...productToUpdate, ...fieldsToUpdate });
      await this.saveProducts(products);
      return { ...productToUpdate, ...fieldsToUpdate };
    } else if (!this.isUpdateValid(fieldsToUpdate)) {
      console.error(`Fields to update not valid: ${fieldsToUpdate}`);
    }
    return null;
  }

  async deleteProduct(productId) {
    const productToDelete = await this.getProductById(productId);
    if (productToDelete) {
      const products = this.products.filter((p) => p.id !== productId);
      await this.saveProducts(products);
      return productToDelete;
    }
    return null;
  }
}
