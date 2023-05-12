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

const router = Router();

router.get("/", getCartsHandler);
router.get("/:cid", validateCartId, getCartByIdHandler);
router.post("/", postCart);
router.post(
  "/:cid/products/:pid",
  validateCartId,
  validateProductId,
  postProductToCart
);
router.put("/:cid", validateCartId, validateProductsOfCart, putCartProducts);
router.put(
  "/:cid/products/:pid",
  validateCartId,
  validateProductId,
  validateProductQuantity,
  putCartProduct
);
router.delete("/:cid", validateCartId, deleteAllProducts);
router.delete(
  "/:cid/products/:pid",
  validateCartId,
  validateProductId,
  deleteProductOfCart
);

export default router;
