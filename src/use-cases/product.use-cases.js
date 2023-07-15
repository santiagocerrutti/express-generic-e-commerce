import { productsService } from "../services/index.js";
import { CustomError, ERROR_CODE } from "../utils.js";

export async function getProducts(limit = null) {
  return productsService.getAll(limit);
}

export async function getProductsPaginate(
  limit = 10,
  page = 1,
  query = {},
  sort = undefined
) {
  return productsService.getAllPaginate(limit, page, query, sort);
}

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

export async function deleteProduct(productId) {
  const result = await productsService.deleteOne(productId);

  if (result) {
    return result;
  }

  throw new CustomError(
    `Product ${productId} not found.`,
    ERROR_CODE.NOT_FOUND
  );
}
