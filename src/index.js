import { ProductManager } from "./ProductManager.js";

function main() {
  const product1 = {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
  };

  const productManager = new ProductManager();

  console.log("getProducts()", productManager.getProducts());
  productManager.addProduct(product1);
  console.log("getProducts()", productManager.getProducts());
  productManager.addProduct(product1);
  console.log("getProducts()", productManager.getProducts());
  console.log("getProductById(1)", productManager.getProductById(1));
  console.log("getProductById(2)", productManager.getProductById(2));
}

main();
