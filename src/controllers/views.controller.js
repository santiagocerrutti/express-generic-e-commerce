import { env } from "../config/env.js";
import {
  getCartById,
  getProducts,
  getProductsPaginate,
} from "../use-cases/index.js";
import { cookieConfig, createTokenFromUser } from "../utils.js";

export class ViewsController {
  constructor() {}

  getProductsView = async (req, res) => {
    const products = await getProducts();

    res.render("index", {
      user: req.user?.user || null,
      products,
    });
  };

  // https://stackoverflow.com/questions/71094583/cannot-read-properties-of-undefined-javascript-class
  getProductsPaginateView = async (req, res) => {
    const { page, limit } = req.query;

    const result = await getProductsPaginate(limit, page);

    const { docs, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } =
      result;

    const prevLink = hasPrevPage ? this._buildLink(req.query, prevPage) : null;
    const nextLink = hasNextPage ? this._buildLink(req.query, nextPage) : null;

    res.render("products", {
      user: req.user?.user || null,
      products: docs,
      totalPages,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      prevLink,
      nextLink,
    });
  };

  _buildLink(reqQuery, page) {
    const { limit } = reqQuery;

    return `${env.HOST_URL}/products?limit=${limit || 10}&page=${page}`;
  }

  getRealTimeProductsView = async (req, res) => {
    const products = await getProducts();

    res.render("realtimeproducts", {
      user: req.user?.user || null,
      products,
    });
  };

  getCartByIdView = async (req, res) => {
    const { cid } = req.params;
    const cart = await getCartById(cid);

    let total = 0;
    for (const item of cart.products) {
      const subtotal = item.product.price * item.quantity;
      item.subtotal = subtotal;
      total += subtotal;
    }
    cart.total = total;

    res.render("cart", {
      user: req.user?.user || null,
      cart,
    });
  };

  getChatView = async (req, res) => {
    res.render("chat", { user: req.user?.user || null });
  };

  getRegisterView = async (req, res) => {
    if (req.user?.user) {
      res.redirect("/products");

      return;
    }

    res.render("register", { user: req.user?.user || null });
  };

  getLoginView = async (req, res) => {
    if (req.user?.user) {
      res.redirect("/products");

      return;
    }

    res.render("login", { user: req.user?.user || null });
  };

  getRegisterFailView = async (req, res) => {
    res.render("register", {
      user: null,
      message: {
        type: "error",
        text: "Internal Server Error. Try again later.",
      },
    });
  };

  getLoginFailView = async (req, res) => {
    res.render("login", {
      user: null,
      message: {
        type: "error",
        text: "Incorrect user and/or password",
      },
    });
  };

  getLogoutView = async (req, res) => {
    try {
      res.render("login", {
        user: null,
        message: {
          type: "success",
          text: "Bye bye :)",
        },
      });

      return;
    } catch (error) {
      req.logger.error(error);
      res.render("login", {
        user: null,
        message: {
          type: "error",
          text: "Internal Server Error. Try again later.",
        },
      });
    }
  };

  getGithubCallbackView = async (req, res) => {
    const { user } = req;

    if (user) {
      const token = createTokenFromUser(user);

      res
        .cookie(env.JWT_COOKIE_NAME, token, cookieConfig)
        .redirect("/products");

      return;
    }

    res.render("login", {
      user: null,
      message: {
        type: "error",
        text: "Incorrect user and/or password",
      },
    });
  };
}

export const viewsController = new ViewsController();
