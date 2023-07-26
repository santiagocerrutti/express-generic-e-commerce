import { v4 as uuid } from "uuid";
import {
  cartsService,
  productsService,
  ticketsService,
  usersService,
} from "../services/index.js";
import { CustomError, ERROR_CODE } from "../utils.js";

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

  throw new CustomError(`Cart ${cartId} not found.`, ERROR_CODE.NOT_FOUND);
}

async function _validateProductOwnership(productId, userId) {
  const product = await productsService.getById(productId);

  if (product.owner === userId) {
    throw new CustomError(
      "User cant add its own product",
      ERROR_CODE.BUSSINES_LOGIC_ERROR
    );
  }
}

export async function addProductToCart(cartId, productId, quantity, userId) {
  const { cartDocument } = await _getCartAndProductDocument(cartId, productId);

  await _validateProductOwnership(productId, userId);

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
    cartProduct.quantity += quantity;
  } else {
    formatedProducts.push({
      product: productId,
      quantity,
    });
  }

  let result = null;

  result = await cartsService.updateOne(cartId, {
    products: formatedProducts,
  });

  if (result) {
    return result;
  }

  throw new CustomError(`Cart ${cartId} not found.`, ERROR_CODE.NOT_FOUND);
}

export async function updateProductsOfCart(cartId, products, userId) {
  for (const detail of products) {
    await _validateProductOwnership(detail.product, userId);
  }

  const result = await cartsService.updateOne(cartId, { products });

  if (result) {
    return result;
  }

  throw new CustomError(`Cart ${cartId} not found.`, ERROR_CODE.NOT_FOUND);
}

export async function deleteProductsOfCart(cartId) {
  const result = cartsService.updateOne(cartId, { products: [] });

  if (result) {
    return result;
  }

  throw new CustomError(`Cart ${cartId} not found.`, ERROR_CODE.NOT_FOUND);
}

export async function updateProductOfCart(cartId, productId, quantity, userId) {
  const { cartDocument } = await _getCartAndProductDocument(cartId, productId);

  await _validateProductOwnership(productId, userId);

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
    throw new CustomError(
      `Product ${productId} not included in cart ${cartId}.`,
      ERROR_CODE.NOT_FOUND
    );
  }

  const result = cartsService.updateOne(cartId, {
    products: formatedProducts,
  });

  if (result) {
    return result;
  }

  throw new CustomError(`Cart ${cartId} not found.`, ERROR_CODE.NOT_FOUND);
}

export async function deleteProductOfCart(cartId, productId, userId) {
  const { cartDocument } = await _getCartAndProductDocument(cartId, productId);

  await _validateProductOwnership(productId, userId);

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
    throw new CustomError(
      `Product ${productId} not included in cart ${cartId}.`,
      ERROR_CODE.NOT_FOUND
    );
  }

  const result = cartsService.updateOne(cartId, {
    products: formatedProducts,
  });

  if (result) {
    return result;
  }

  throw new CustomError(
    `Product ${productId} not found.`,
    ERROR_CODE.NOT_FOUND
  );
}

async function _getCartAndProductDocument(cartId, productId) {
  const cartDocument = await cartsService.getById(cartId);

  if (!cartDocument) {
    throw new CustomError(`Cart ${cartId} not found.`, ERROR_CODE.NOT_FOUND);
  }

  const productDocument = await productsService.getById(productId);

  if (!productDocument) {
    throw new CustomError(
      `Product ${productId} not found.`,
      ERROR_CODE.NOT_FOUND
    );
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

  for (const product of cart.products) {
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
}
