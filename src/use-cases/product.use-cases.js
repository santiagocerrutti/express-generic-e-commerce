import { productDeletedHtmlTemplate } from "../mail/email-templates.js";
import { sendEmail } from "../mail/mail-service.js";
import { productsService, usersService } from "../services/index.js";
import { CustomError, ERROR_CODE } from "../utils.js";

/**
 * Retrieves a list of products.
 *
 * @param {number} [limit=null] - The maximum number of products to retrieve.
 * @returns {Promise<Array>} - A promise that resolves to an array of products.
 */
export async function getProducts(limit = null) {
  return productsService.getAll(limit);
}

/**
 * Retrieves a paginated list of products.
 *
 * @param {number} [limit=10] - The maximum number of products to retrieve per page.
 * @param {number} [page=1] - The page number to retrieve.
 * @param {object} [query={}] - The query object to filter the products.
 * @param {string} [sort=undefined] - The field to sort the products by.
 * @returns {Promise<Array>} - A promise that resolves to an array of products.
 */
export async function getProductsPaginate(
  limit = 10,
  page = 1,
  query = {},
  sort = undefined
) {
  return productsService.getAllPaginate(limit, page, query, sort);
}

/**
 * Retrieves a product by its ID.
 *
 * @param {string} productId - The ID of the product to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the retrieved product.
 * @throws {CustomError} - If the product with the specified ID is not found.
 */
export async function getProductById(productId) {
  const product = await productsService.getById(productId);

  if (product) {
    return product;
  }

  throw new CustomError(
    `Product ${productId} not found.`,
    ERROR_CODE.NOT_FOUND
  );
}

/**
 * Adds a new product.
 *
 * @param {Object} product - The product to be added.
 * @returns {Promise<Object>} - The newly added product.
 * @throws {CustomError} - If the product code is duplicated.
 */
export async function addProduct(product) {
  try {
    const newProduct = await productsService.addOne({ ...product });

    return newProduct;
  } catch (error) {
    throw new CustomError(
      `Code ${product.code} duplicated`,
      ERROR_CODE.DUPLICATED_KEY
    );
  }
}

/**
 * Updates a product with the specified productId and fieldsToUpdate.
 *
 * @param {string} productId - The ID of the product to update.
 * @param {object} fieldsToUpdate - The fields to update in the product.
 * @returns {Promise<object>} - A promise that resolves to the updated product.
 * @throws {CustomError} - If the fieldsToUpdate.code is duplicated, throws a CustomError with code DUPLICATED_KEY.
 * @throws {CustomError} - If the product with the specified productId is not found, throws a CustomError with code NOT_FOUND.
 */
export async function updateProduct(productId, fieldsToUpdate) {
  let result = null;
  try {
    result = await productsService.updateOne(productId, fieldsToUpdate);
  } catch (error) {
    throw new CustomError(
      `Code ${fieldsToUpdate.code} duplicated`,
      ERROR_CODE.DUPLICATED_KEY
    );
  }

  if (result) {
    return result;
  }

  throw new CustomError(
    `Product ${productId} not found.`,
    ERROR_CODE.NOT_FOUND
  );
}

async function _notifyDeletedProductToUser(product) {
  const user = await usersService.getById(product.owner);

  await sendEmail(
    user.email,
    "Account Deleted",
    productDeletedHtmlTemplate({
      name: user.name,
      productId: product._id,
      productTitle: product.title,
    })
  );
}

/**
 * Deletes a product with the given productId.
 *
 * @param {string} productId - The ID of the product to be deleted.
 * @returns {Promise} - A promise that resolves to the result of the deletion.
 * @throws {CustomError} - If the product with the given productId is not found.
 */
export async function deleteProduct(productId) {
  const product = await productsService.updateOne(productId, { deleted: true });

  if (product) {
    if (product.owner) {
      await _notifyDeletedProductToUser(product);
    }

    return product;
  }

  throw new CustomError(
    `Product ${productId} not found.`,
    ERROR_CODE.NOT_FOUND
  );
}
