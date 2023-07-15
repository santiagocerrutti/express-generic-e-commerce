import QueryString from "qs";
import { env } from "../config/env.js";
import { SocketServer } from "../sockets/socket-server.js";
import {
  addProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getProductsPaginate,
  updateProduct,
} from "../use-cases/index.js";

class ProductsController {
  constructor() {}

  getProducts = async (req, res) => {
    const { limit, page, query, sort } = req.query;
    const queryObject = query
      ? QueryString.parse(query, { delimiter: /[;,]/ })
      : {};

    const { docs, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } =
      await getProductsPaginate(limit, page, queryObject, sort);

    const prevLink = hasPrevPage ? this._buildLink(req.query, prevPage) : null;
    const nextLink = hasNextPage ? this._buildLink(req.query, nextPage) : null;

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
  };

  _buildLink(reqQuery, page) {
    const { limit, sort, query } = reqQuery;

    return `${env.HOST_URL}/api/products?limit=${limit || 10}&page=${page}${
      query ? "&query=" + query : ""
    }${sort ? "&sort=" + sort : ""}`;
  }

  getProductById = async (req, res, next) => {
    const { pid } = req.params;

    try {
      if (pid) {
        const foundProduct = await getProductById(pid);

        res.sendSuccess(foundProduct);
      }
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req, res, next) => {
    try {
      const result = await addProduct(req.body);

      await this._emitProductsUpdate();

      res.sendCreated(result);
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req, res, next) => {
    try {
      const result = await updateProduct(req.params.pid, req.body);

      await this._emitProductsUpdate();

      res.sendSuccess(result);
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      const result = await deleteProduct(req.params.pid);

      await this._emitProductsUpdate();

      res.sendSuccess(result);
    } catch (error) {
      next(error);
    }
  };

  async _emitProductsUpdate() {
    const products = await getProducts();

    SocketServer.getInstance().emit("products-updated", products);
  }
}

export const productsController = new ProductsController();
