import { Schema, model, Types } from "mongoose";
import { productCollection } from "./product.model.js";

export const ticketCollection = "tickets";

export const ticketSchema = new Schema({
  _id: {
    type: Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
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
        type: Types.ObjectId,
        ref: productCollection,
        required: true,
      },
    },
  ],
});

export const TicketModel = model(ticketCollection, ticketSchema);
