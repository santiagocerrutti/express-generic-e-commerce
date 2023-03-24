import { ProductManager } from "./ProductManager.js";

async function main() {
  const product1 = {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
  };

  const productManager = new ProductManager("data/products.json");

  console.log("getProducts()");
  console.log(await productManager.getProducts());
  console.log("------------------------------------------------");
  console.log("productManager.addProduct(product1)");
  console.log(await productManager.addProduct(product1));
  console.log("------------------------------------------------");
  console.log("getProducts()");
  console.log(await productManager.getProducts());
  console.log("------------------------------------------------");
  console.log("productManager.addProduct({ ...product1, code: 'abc456' })");
  console.log(await productManager.addProduct({ ...product1, code: "abc456" }));
  console.log("------------------------------------------------");
  console.log("getProducts()");
  console.log(await productManager.getProducts());
  console.log("------------------------------------------------");
  console.log("getProductById(1)");
  console.log(await productManager.getProductById(1));
  console.log("------------------------------------------------");
  console.log("getProductById(2)");
  console.log(await productManager.getProductById(2));
  console.log("------------------------------------------------");
  console.log("updateProduct(1, { price: 400})");
  console.log(await productManager.updateProduct(1, { price: 400 }));
  console.log("------------------------------------------------");
  console.log("updateProduct(1, { proce: 400})");
  console.log(await productManager.updateProduct(1, { proce: 400 }));
  console.log("------------------------------------------------");
  console.log("updateProduct(8, { price: 400})");
  console.log(await productManager.updateProduct(8, { price: 400 }));
  console.log("------------------------------------------------");
  console.log("deleteProduct(2)");
  console.log(await productManager.deleteProduct(2));
}

main();
