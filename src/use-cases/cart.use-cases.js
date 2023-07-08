import { v4 as uuid } from "uuid";
import {
  cartsService,
  productsService,
  ticketsService,
  usersService,
} from "../services/index.js";

export async function addCart(user) {
  const newCart = await cartsService.addOne({});

  await usersService.updateOne(user._id, {
    cart: newCart._id,
  });

  return newCart;
}

export async function getCarts(limit = 0) {
  return cartsService.getAll(limit);
}

export async function getCartById(cartId) {
  const cart = await cartsService.getById(cartId);

  if (cart) {
    return cart;
  }

  const error = new Error(`Cart ${cartId} not found.`);
  error.code = "NOT_FOUND";

  throw error;
}

export async function addProductToCart(cartId, productId, quantity) {
  const { cartDocument } = await _getCartAndProductDocument(cartId, productId);

  const formatedProducts = cartDocument.products.map((p) => {
    return {
      product: p.product._id,
      quantity: p.quantity,
    };
  });

  const cartProduct = formatedProducts.find(
    (p) => p.product.toString() === productId.toString()
  );

  console.log(cartProduct);

  if (cartProduct) {
    cartProduct.quantity += quantity;
  } else {
    formatedProducts.push({
      product: productId,
      quantity,
    });
  }

  let result = null;

  try {
    console.log(cartDocument.products);
    result = await cartsService.updateOne(cartId, {
      products: formatedProducts,
    });
  } catch (error) {
    console.log("HERE IN USE CASE");
    console.log(error);

    throw error;
  }

  if (result) {
    return result;
  }

  const e = new Error(`Cart ${cartId} not found.`);
  e.code = "NOT_FOUND";

  throw e;
}

export async function updateProductsOfCart(cartId, products) {
  const result = await cartsService.updateOne(cartId, { products });

  if (result) {
    return result;
  }

  const e = new Error(`Cart ${cartId} not found.`);
  e.code = "NOT_FOUND";

  throw e;
}

export async function deleteProductsOfCart(cartId) {
  const result = cartsService.updateOne(cartId, { products: [] });

  if (result) {
    return result;
  }

  const e = new Error(`Cart ${cartId} not found.`);
  e.code = "NOT_FOUND";

  throw e;
}

export async function updateProductOfCart(cartId, productId, quantity) {
  const { cartDocument } = await _getCartAndProductDocument(cartId, productId);

  const formatedProducts = cartDocument.products.map((p) => {
    return {
      product: p.product._id,
      quantity: p.quantity,
    };
  });

  const cartProduct = formatedProducts.find(
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

  const result = cartsService.updateOne(cartId, {
    products: formatedProducts,
  });

  if (result) {
    return result;
  }

  const e = new Error(`Cart ${cartId} not found.`);
  e.code = "NOT_FOUND";

  throw e;
}

export async function deleteProductOfCart(cartId, productId) {
  const { cartDocument } = await _getCartAndProductDocument(cartId, productId);

  let formatedProducts = cartDocument.products.map((p) => {
    return {
      product: p.product._id,
      quantity: p.quantity,
    };
  });

  const cartProduct = formatedProducts.find(
    (p) => p.product.toString() === productId.toString()
  );

  if (cartProduct) {
    formatedProducts = formatedProducts.filter(
      (p) => p.product.toString() !== productId.toString()
    );
  } else {
    const error = new Error(
      `Product ${productId} not included in cart ${cartId}.`
    );
    error.code = "NOT_FOUND";

    throw error;
  }

  const result = cartsService.updateOne(cartId, {
    products: formatedProducts,
  });

  if (result) {
    return result;
  }

  const e = new Error(`Product ${productId} not found.`);
  e.code = "NOT_FOUND";

  throw e;
}

async function _getCartAndProductDocument(cartId, productId) {
  const cartDocument = await cartsService.getById(cartId);

  if (!cartDocument) {
    const error = new Error(`Cart ${cartId} not found.`);
    error.code = "NOT_FOUND";

    throw error;
  }

  const productDocument = await productsService.getById(productId);

  if (!productDocument) {
    const error = new Error(`Product ${productId} not found.`);
    error.code = "NOT_FOUND";

    throw error;
  }

  return {
    cartDocument,
    productDocument,
  };
}

export async function purchaseCart(cartId, user) {
  const { email } = user;
  const cart = await cartsService.getById(cartId);

  const updatedCart = {
    products: [],
  };
  const ticket = {
    code: uuid(),
    amount: 0,
    products: [],
    purchaser: email,
  };

  try {
    for (const product of cart.products) {
      console.log(product);
      const productObject = await productsService.getById(product.product._id);

      if (productObject.stock >= product.quantity) {
        ticket.amount += product.quantity * productObject.price;
        ticket.products.push({
          product: productObject._id,
          quantity: product.quantity,
        });

        await productsService.updateOne(product.product._id, {
          stock: productObject.stock - product.quantity,
        });
      } else {
        updatedCart.products.push({
          product: productObject._id,
          quantity: product.quantity - productObject.stock,
        });

        if (productObject.stock) {
          ticket.amount += productObject.stock * productObject.price;
          ticket.products.push({
            product: productObject._id,
            quantity: productObject.stock,
          });
        }

        await productsService.updateOne(product.product._id, { stock: 0 });
      }
    }

    await cartsService.updateOne(cartId, updatedCart);
    const createdTicket = await ticketsService.addOne(ticket);

    return createdTicket;
  } catch (error) {
    console.log(error);

    throw error;
  }
}
