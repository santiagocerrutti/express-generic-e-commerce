import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
/** @see https://www.npmjs.com/package/uuid-mongodb */
import MUUID from "uuid-mongodb";
import { userCollection } from "./user.model.js";

MUUID.mode("relaxed");

export const productCollection = "products";

export const productSchema = new Schema({
  _id: { type: "object", value: { type: "Buffer" }, default: () => MUUID.v4() },
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true },
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
  owner: {
    type: "object",
    value: { type: "Buffer" },
    ref: userCollection,
    required: true,
  },
});
productSchema.plugin(mongoosePaginate);

export const ProductModel = model(productCollection, productSchema);
