import QueryString from "qs";
import { env } from "../config/env.js";
import { SocketServer } from "../sockets/socket-server.js";
import { productsService } from "../services/index.js";

export async function getProducts(req, res) {
  const { limit, page, query, sort } = req.query;
  const queryObject = query
    ? QueryString.parse(query, { delimiter: /[;,]/ })
    : {};

  const { docs, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } =
    await productsService.getProductsPaginate(limit, page, queryObject, sort);

  const prevLink = hasPrevPage ? buildLink(req.query, prevPage) : null;
  const nextLink = hasNextPage ? buildLink(req.query, nextPage) : null;

  res.send({
    status: "SUCCESS",
    payload: docs,
    totalPages,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    prevLink,
    nextLink,
  });
}

function buildLink(reqQuery, page) {
  const { limit, sort, query } = reqQuery;

  return `${env.HOST_URL}/api/products?limit=${limit || 10}&page=${page}${
    query ? "&query=" + query : ""
  }${sort ? "&sort=" + sort : ""}`;
}

export async function getProductById(req, res) {
  const { pid } = req.params;

  try {
    if (pid) {
      const foundProduct = await productsService.getProductById(pid);

      res.sendSuccess(foundProduct);
    }
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      res.sendNotFound(error.message);

      return;
    }

    res.sendInternalServerError();
  }
}

export async function createProduct(req, res) {
  try {
    const result = await productsService.addProduct(req.body);

    await emitProductsUpdate(productsService);

    res.sendCreated(result);
  } catch (error) {
    if (error.code === "DUPLICATED_KEY") {
      res.sendConflict(error.message);

      return;
    }

    res.sendInternalServerError();
  }
}

export async function updateProduct(req, res) {
  try {
    const result = await productsService.updateProduct(
      req.params.pid,
      req.body
    );

    await emitProductsUpdate(productsService);

    res.sendSuccess(result);
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      res.sendNotFound(error.message);

      return;
    } else if (error.code === "DUPLICATED_KEY") {
      res.sendConflict(error.message);

      return;
    }

    res.sendInternalServerError();
  }
}

export async function deleteProduct(req, res) {
  try {
    const result = await productsService.deleteProduct(req.params.pid);

    await emitProductsUpdate(productsService);

    res.sendSuccess(result);
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      res.sendNotFound(error.message);

      return;
    }

    res.sendInternalServerError();
  }
}

async function emitProductsUpdate(productsService) {
  const products = await productsService.getProducts();

  SocketServer.getInstance().emit("products-updated", products);
}
