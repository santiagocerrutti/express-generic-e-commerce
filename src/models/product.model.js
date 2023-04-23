import { randomUUID } from "crypto";
import { Schema, model } from "mongoose";

const productCollection = "products";

const productSchema = new Schema({
  _id: { type: Schema.Types.UUID, default: () => randomUUID() },
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, required: true },
  stock: {
    type: Number,
    required: true,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
  },
  category: { type: String, required: true },
  thumbnails: { type: [String] },
});

export const ProductModel = model(productCollection, productSchema);
