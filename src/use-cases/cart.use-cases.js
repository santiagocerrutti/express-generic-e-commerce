import { cartsService, productsService } from "../services/index.js";

export async function addCart() {
  const newCart = await cartsService.addOne({});

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

  const cartProduct = cartDocument.products.find(
    (p) => p.product.toString() === productId.toString()
  );

  if (cartProduct) {
    cartProduct.quantity += quantity;
  } else {
    cartDocument.products.push({
      product: productId,
      quantity,
    });
  }

  const result = cartsService.updateOne(cartId, {
    products: cartDocument.products,
  });

  if (result) {
    return result;
  }

  const e = new Error(`Cart ${cartId} not found.`);
  e.code = "NOT_FOUND";

  throw e;
}

export async function updateProductsOfCart(cartId, products) {
  const result = cartsService.updateOne(cartId, { products });

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

  const cartProduct = cartDocument.products.find(
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
    products: cartDocument.products,
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

  const cartProduct = cartDocument.products.find(
    (p) => p.product.toString() === productId.toString()
  );

  if (cartProduct) {
    cartDocument.products = cartDocument.products.filter(
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
    products: cartDocument.products,
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

export async function purchaseCart(cartId) {
  const cart = await cartsService.getById(cartId);

  return cart;
}
