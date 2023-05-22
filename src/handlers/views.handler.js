import { env } from "../config/env.js";
import { CartManager } from "../dao/db/cart.manager.js";
import { ProductManager } from "../dao/db/product.manager.js";

export async function getProductsHandler(req, res) {
  const manager = new ProductManager();
  const products = await manager.getProductsJson();

  res.render("index", {
    user: req.session.user,
    products,
  });
}

export async function getProductsPaginateHandler(req, res) {
  const { page, limit } = req.query;
  const manager = new ProductManager();

  const result = await manager.getProductsPaginateJson(limit, page);

  const { docs, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } =
    result;
  const prevLink = hasPrevPage ? buildLink(req.query, prevPage) : null;
  const nextLink = hasNextPage ? buildLink(req.query, nextPage) : null;

  res.render("products", {
    user: req.session.user,
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

export async function getRealTimeProductsHandler(req, res) {
  const manager = new ProductManager();
  const products = await manager.getProductsJson();

  res.render("realtimeproducts", {
    user: req.session.user,
    products,
  });
}

export async function getCartByIdHandler(req, res) {
  const { cid } = req.params;
  const manager = new CartManager();
  const cart = await manager.getCartByIdJson(cid);

  let total = 0;
  for (const item of cart.products) {
    const subtotal = item.product.price * item.quantity;
    item.subtotal = subtotal;
    total += subtotal;
  }
  cart.total = total;

  res.render("cart", {
    user: req.session.user,
    cart,
  });
}

export async function getChatHandler(req, res) {
  res.render("chat", {});
}

export async function getRegisterHandler(req, res) {
  res.render("register", { user: req.session.user });
}

export async function getLoginHandler(req, res) {
  res.render("login", { user: req.session.user });
}

export async function getProfileHandler(req, res) {
  res.render("profile", { user: req.session.user });
}
