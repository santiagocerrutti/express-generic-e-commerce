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

  console.log("getProducts()", await productManager.getProducts());
  await productManager.addProduct(product1);
  console.log("getProducts()", await productManager.getProducts());
  await productManager.addProduct(product1);
  console.log("getProducts()", await productManager.getProducts());
  console.log("getProductById(1)", await productManager.getProductById(1));
  console.log("getProductById(2)", await productManager.getProductById(2));
}

main();
