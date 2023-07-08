import { Schema, model } from "mongoose";
/** @see https://www.npmjs.com/package/uuid-mongodb */
import MUUID from "uuid-mongodb";
import { productCollection } from "./product.model.js";
MUUID.mode("relaxed");

export const ticketCollection = "tickets";

export const ticketSchema = new Schema({
  _id: { type: "object", value: { type: "Buffer" }, default: MUUID.v4() },
  code: { type: String, required: true, unique: true },
  purchase_date: { type: Date, required: true, default: Date.now },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
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

export const TicketModel = model(ticketCollection, ticketSchema);
