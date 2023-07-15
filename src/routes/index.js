import express, { Router } from "express";
import { __dirname } from "../utils.js";
import { cartsRouter } from "./carts.routes.js";
import { mocksRouter } from "./mocks.routes.js";
import { productsRouter } from "./products.routes.js";
import { sessionsRouter } from "./sessions.routes.js";
import { viewsRouter } from "./views.routes.js";

const router = Router();

/** Routes */
router.use("/", viewsRouter);
router.use("/static", express.static(`${__dirname}/public`));
router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);
router.use("/api/sessions", sessionsRouter);
router.use("/api/mocking", mocksRouter);

export default router;
