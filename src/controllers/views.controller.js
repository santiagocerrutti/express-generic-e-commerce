import { env } from "../config/env.js";
import { CartDaoMongo } from "../dao/db/cart.dao.mongo.js";
import { ProductDaoMongo } from "../dao/db/product.dao.mongo.js";
import { cookieConfig, createTokenFromUser } from "./sessions.controller.js";

export async function getProductsView(req, res) {
  const manager = new ProductDaoMongo();
  const products = await manager.getProductsJson();

  res.render("index", {
    user: req.user?.user || null,
    products,
  });
}

export async function getProductsPaginateView(req, res) {
  const { page, limit } = req.query;
  const manager = new ProductDaoMongo();

  const result = await manager.getProductsPaginateJson(limit, page);

  const { docs, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } =
    result;
  const prevLink = hasPrevPage ? buildLink(req.query, prevPage) : null;
  const nextLink = hasNextPage ? buildLink(req.query, nextPage) : null;

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
}

function buildLink(reqQuery, page) {
  const { limit } = reqQuery;

  return `${env.HOST_URL}/products?limit=${limit || 10}&page=${page}`;
}

export async function getRealTimeProductsView(req, res) {
  const manager = new ProductDaoMongo();
  const products = await manager.getProductsJson();

  res.render("realtimeproducts", {
    user: req.user?.user || null,
    products,
  });
}

export async function getCartByIdView(req, res) {
  const { cid } = req.params;
  const manager = new CartDaoMongo();
  const cart = await manager.getCartByIdJson(cid);

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
}

export async function getChatView(req, res) {
  res.render("chat", {});
}

export async function getRegisterView(req, res) {
  if (req.user?.user) {
    res.redirect("/products");

    return;
  }

  res.render("register", { user: req.user?.user || null });
}

export async function getLoginView(req, res) {
  if (req.user?.user) {
    res.redirect("/products");

    return;
  }

  res.render("login", { user: req.user?.user || null });
}

export async function getRegisterFailView(req, res) {
  res.render("register", {
    user: null,
    message: {
      type: "error",
      text: "Internal Server Error. Try again later.",
    },
  });
}

export async function getLoginFailView(req, res) {
  res.render("login", {
    user: null,
    message: {
      type: "error",
      text: "Incorrect user and/or password",
    },
  });
}

export async function getLogoutView(req, res) {
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
    console.log(error);
    res.render("login", {
      user: null,
      message: {
        type: "error",
        text: "Internal Server Error. Try again later.",
      },
    });
  }
}

export async function getGithubCallbackView(req, res) {
  const { user } = req;

  if (user) {
    const token = createTokenFromUser(user);

    res.cookie(env.JWT_COOKIE_NAME, token, cookieConfig).redirect("/products");

    return;
  }

  res.render("login", {
    user: null,
    message: {
      type: "error",
      text: "Incorrect user and/or password",
    },
  });
}
