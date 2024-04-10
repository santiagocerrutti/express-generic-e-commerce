import { Schema, model, Types } from "mongoose";
import { productCollection } from "./product.model.js";

export const cartCollection = "carts";

export const cartSchema = new Schema({
  _id: {
    type: Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
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
        type: Types.ObjectId,
        ref: productCollection,
        required: true,
      },
    },
  ],
});

export const CartModel = model(cartCollection, cartSchema);
