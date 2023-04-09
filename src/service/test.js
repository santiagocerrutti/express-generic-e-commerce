import { ProductManager } from "./ProductManager.js";

async function test() {
  const product1 = {
    title: "producto prueba",
    description: "Este es un producto prueba",
    code: "abc123",
    price: 200,
    status: true,
    stock: 25,
    category: "CATEGORY",
  };

  const productManager = new ProductManager("data/products.json");

  try {
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
    console.log(
      await productManager.addProduct({ ...product1, code: "abc456" })
    );
    console.log("------------------------------------------------");
    console.log("getProducts()");
    console.log(await productManager.getProducts());
    // console.log("------------------------------------------------");
    // console.log("getProductById(1)");
    // console.log(await productManager.getProductById(1));
    // console.log("------------------------------------------------");
    // console.log("getProductById(2)");
    // console.log(await productManager.getProductById(2));
    // console.log("------------------------------------------------");
    // console.log("updateProduct(1, { price: 400})");
    // console.log(await productManager.updateProduct(1, { price: 400 }));
    // console.log("------------------------------------------------");
    // console.log("updateProduct(1, { proce: 400})");
    // console.log(await productManager.updateProduct(1, { proce: 400 }));
    // console.log("------------------------------------------------");
    // console.log("updateProduct(8, { price: 400})");
    // console.log(await productManager.updateProduct(8, { price: 400 }));
    // console.log("------------------------------------------------");
    // console.log("deleteProduct(2)");
    // console.log(await productManager.deleteProduct(2));
  } catch (error) {
    console.log(error);
  }
}

test();
