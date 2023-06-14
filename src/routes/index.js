import express, { Router } from "express";
import { __dirname } from "../utils.js";
import { viewsRouter } from "./views.routes.js";
import { productsRouter } from "./products.routes.js";
import { cartsRouter } from "./carts.routes.js";
import { sessionsRouter } from "./sessions.routes.js";

const router = Router();

/** Routes */
router.use("/", viewsRouter);
router.use("/static", express.static(`${__dirname}/public`));
router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);
router.use("/api/sessions", sessionsRouter);

export default router;
