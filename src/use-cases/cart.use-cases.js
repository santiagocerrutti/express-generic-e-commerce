import { v4 as uuid } from "uuid";
import {
  cartsService,
  productsService,
  ticketsService,
  usersService,
} from "../services/index.js";
import { CustomError, ERROR_CODE } from "../utils.js";

/**
 * Adds a new cart.
 *
 * @param {Object} user - The user object.
 * @returns {Promise<Object>} - The newly created cart object.
 */
export async function addCart(user) {
  const newCart = await cartsService.addOne({});

  if (user) {
    await usersService.updateOne(user._id, {
      cart: newCart._id,
    });
  }

  return newCart;
}

/**
 * Retrieves a list of carts.
 *
 * @param {number} [limit=0] - The maximum number of carts to retrieve. Defaults to 0, which retrieves all carts.
 * @returns {Promise<Array>} - A promise that resolves to an array of carts.
 */
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

/**
 * Validates if the specified product is owned by the given user.
 *
 * @param {string} productId - The unique identifier of the product to be validated.
 * @param {string} userId - The unique identifier of the user claiming ownership of the product.
 * @returns {Promise<void>} A promise that resolves with no value if the user does not own the product, else rejects with a `CustomError`.
 */
async function _validateProductOwnership(productId, userId) {
  const product = await productsService.getById(productId);

  if (product.owner === userId) {
    throw new CustomError(
      "User cant add its own product",
      ERROR_CODE.BUSINESS_LOGIC_ERROR
    );
  }
}

/**
 * Adds a product to a cart.
 *
 * @param {string} cartId - The ID of the cart.
 * @param {string} productId - The ID of the product.
 * @param {number} quantity - The quantity of the product to add.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Object>} The updated cart object.
 * @throws {CustomError} If the cart or product is not found, or if the user is trying to add their own product.
 */
export async function addProductToCart(cartId, productId, quantity, userId) {
  const { cartDocument } = await _getCartAndProductDocument(cartId, productId);

  await _validateProductOwnership(productId, userId);

  const formattedProducts = cartDocument.products.map((p) => {
    return {
      product: p.product._id,
      quantity: p.quantity,
    };
  });

  const cartProduct = formattedProducts.find(
    (p) => p.product.toString() === productId.toString()
  );

  if (cartProduct) {
    cartProduct.quantity += quantity;
  } else {
    formattedProducts.push({
      product: productId,
      quantity,
    });
  }

  let result = null;

  result = await cartsService.updateOne(cartId, {
    products: formattedProducts,
  });

  if (result) {
    return result;
  }

  throw new CustomError(`Cart ${cartId} not found.`, ERROR_CODE.NOT_FOUND);
}

/**
 * Updates the products of a cart.
 *
 * @param {string} cartId - The ID of the cart to update.
 * @param {Array} products - An array of product details to update in the cart.
 * @param {string} userId - The ID of the user performing the update.
 * @returns {Promise} - A promise that resolves to the updated cart object.
 * @throws {CustomError} - If the user is trying to add their own product or if the cart is not found.
 */
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

/**
 * Deletes all products from a cart.
 *
 * @param {string} cartId - The ID of the cart to delete products from.
 * @returns {Promise} - A promise that resolves to the updated cart object if successful.
 * @throws {CustomError} - If the cart with the specified ID is not found.
 */
export async function deleteProductsOfCart(cartId) {
  const result = await cartsService.updateOne(cartId, { products: [] });

  if (result) {
    return result;
  }

  throw new CustomError(`Cart ${cartId} not found.`, ERROR_CODE.NOT_FOUND);
}

/**
 * Updates the quantity of a product in a cart.
 *
 * @param {string} cartId - The ID of the cart.
 * @param {string} productId - The ID of the product.
 * @param {number} quantity - The new quantity of the product.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Object>} The updated cart object.
 * @throws {CustomError} If the user is not authorized to update the product or if the cart or product is not found.
 */
export async function updateProductOfCart(cartId, productId, quantity, userId) {
  const { cartDocument } = await _getCartAndProductDocument(cartId, productId);

  await _validateProductOwnership(productId, userId);

  const formattedProducts = cartDocument.products.map((p) => {
    return {
      product: p.product._id,
      quantity: p.quantity,
    };
  });

  const cartProduct = formattedProducts.find(
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
    products: formattedProducts,
  });

  if (result) {
    return result;
  }

  throw new CustomError(`Cart ${cartId} not found.`, ERROR_CODE.NOT_FOUND);
}

/**
 * Deletes a product from a cart.
 *
 * @param {string} cartId - The ID of the cart.
 * @param {string} productId - The ID of the product to be deleted.
 * @param {string} userId - The ID of the user performing the action.
 * @returns {Promise} - A promise that resolves to the updated cart object if successful.
 * @throws {CustomError} - If the cart or product is not found, or if the user is not authorized to delete the product.
 */
export async function deleteProductOfCart(cartId, productId, userId) {
  const { cartDocument } = await _getCartAndProductDocument(cartId, productId);

  await _validateProductOwnership(productId, userId);

  let formattedProducts = cartDocument.products.map((p) => {
    return {
      product: p.product._id,
      quantity: p.quantity,
    };
  });

  const cartProduct = formattedProducts.find(
    (p) => p.product.toString() === productId.toString()
  );

  if (cartProduct) {
    formattedProducts = formattedProducts.filter(
      (p) => p.product.toString() !== productId.toString()
    );
  } else {
    throw new CustomError(
      `Product ${productId} not included in cart ${cartId}.`,
      ERROR_CODE.NOT_FOUND
    );
  }

  const result = cartsService.updateOne(cartId, {
    products: formattedProducts,
  });

  if (result) {
    return result;
  }

  throw new CustomError(
    `Product ${productId} not found.`,
    ERROR_CODE.NOT_FOUND
  );
}

/**
 * Retrieves the cart document and product document based on the provided cartId and productId.
 *
 * @param {string} cartId - The ID of the cart.
 * @param {string} productId - The ID of the product.
 * @returns {Promise<{cartDocument: Object, productDocument: Object}>} - The cart document and product document.
 * @throws {CustomError} If the cart with the specified cartId is not found.
 * @throws {CustomError} If the product with the specified productId is not found.
 * @private
 */
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

/**
 * Purchase items from a cart and generate a ticket.
 *
 * @param {string} cartId - The ID of the cart to purchase from.
 * @param {object} user - The user object containing the email of the purchaser.
 * @returns {object} - The created ticket object.
 * @throws {CustomError} - If there is an error during the purchase process.
 */
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
