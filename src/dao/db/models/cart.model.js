import { Schema, model } from "mongoose";
import MUUID from "uuid-mongodb";
import { productCollection } from "./product.model.js";

export const cartCollection = "carts";

export const cartSchema = new Schema({
  _id: { type: "object", value: { type: "Buffer" }, default: MUUID.v4() },
  products: [
    {
      _id: false,
      quantity: {
        type: Number,
        required: true,
        get: (v) => Math.round(v),
        set: (v) => Math.round(v),
      },
      product: {
        type: "object",
        value: { type: "Buffer" },
        ref: productCollection,
        required: true,
      },
    },
  ],
});

export const CartModel = model(cartCollection, cartSchema);
