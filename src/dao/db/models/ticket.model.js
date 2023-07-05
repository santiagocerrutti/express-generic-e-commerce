import { Schema, model } from "mongoose";
/** @see https://www.npmjs.com/package/uuid-mongodb */
import MUUID from "uuid-mongodb";
MUUID.mode("relaxed");

export const ticketCollection = "tickets";

export const ticketSchema = new Schema({
  _id: { type: "object", value: { type: "Buffer" }, default: MUUID.v4() },
  code: { type: String, required: true, unique: true },
  purchase_date: { type: Date, required: true, default: Date.now },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
});

export const TocketModel = model(ticketCollection, ticketSchema);
