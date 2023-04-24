import { Schema, model } from "mongoose";
import { productCollection } from "./product.model";
import MUUID from "uuid-mongodb";

export const cartCollection = "carts";

export const cartSchema = new Schema({
  _id: { type: "object", value: { type: "Buffer" }, default: MUUID.v4() },
  products: [
    {
      quantity: {
        type: Number,
        required: true,
        get: (v) => Math.round(v),
        set: (v) => Math.round(v),
      },
      product: { type: Schema.Types.UUID, ref: productCollection },
    },
  ],
});

export const CartModel = model(cartCollection, cartSchema);
