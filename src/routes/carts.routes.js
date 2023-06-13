import { Router } from "express";
import {
  getCartByIdHandler,
  getCartsHandler,
  postCart,
  postProductToCart,
  putCartProducts,
  putCartProduct,
  deleteAllProducts,
  deleteProductOfCart,
} from "../handlers/carts.handler.js";
import {
  validateCartId,
  validateProductQuantity,
  validateProductsOfCart,
} from "../middlewares/validation/cart.validator.js";
import { validateProductId } from "../middlewares/validation/product.validator.js";
import { isAuthenticated } from "../middlewares/auth/index.js";

const router = Router();

router.get("/", isAuthenticated, getCartsHandler);
router.get("/:cid", isAuthenticated, validateCartId, getCartByIdHandler);
router.post("/", isAuthenticated, postCart);
router.post(
  "/:cid/products/:pid",
  isAuthenticated,
  validateCartId,
  validateProductId,
  postProductToCart
);
router.put(
  "/:cid",
  isAuthenticated,
  validateCartId,
  validateProductsOfCart,
  putCartProducts
);
router.put(
  "/:cid/products/:pid",
  isAuthenticated,
  validateCartId,
  validateProductId,
  validateProductQuantity,
  putCartProduct
);
router.delete("/:cid", isAuthenticated, validateCartId, deleteAllProducts);
router.delete(
  "/:cid/products/:pid",
  isAuthenticated,
  validateCartId,
  validateProductId,
  deleteProductOfCart
);

export default router;
