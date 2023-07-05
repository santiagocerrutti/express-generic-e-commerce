import { productsService } from "../services/index.js";

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

  const error = new Error(`Product ${productId} not found.`);
  error.code = "NOT_FOUND";

  throw error;
}

export async function addProduct(product) {
  try {
    const newProduct = await productsService.addOne({ ...product });

    return newProduct;
  } catch (error) {
    const e = new Error(`Code ${product.code} duplicated`);
    e.code = "DUPLICATED_KEY";

    throw e;
  }
}

export async function updateProduct(productId, fieldsToUpdate) {
  let result = null;
  try {
    result = await productsService.updateOne(productId, fieldsToUpdate);
  } catch (error) {
    const e = new Error(`Code ${fieldsToUpdate.code} duplicated`);
    e.code = "DUPLICATED_KEY";

    throw e;
  }

  if (result) {
    return result;
  }

  const e = new Error(`Product ${productId} not found.`);
  e.code = "NOT_FOUND";

  throw e;
}

export async function deleteProduct(productId) {
  const result = await productsService.deleteOne(productId);

  if (result) {
    return result;
  }

  const error = new Error(`Product ${productId} not found.`);
  error.code = "NOT_FOUND";

  throw error;
}
