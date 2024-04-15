import { Schema, model, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { userCollection } from "./user.model.js";

export const productCollection = "products";

export const productSchema = new Schema({
  _id: {
    type: Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
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
    type: Types.ObjectId,
    ref: userCollection,
    required: true,
  },
  deleted: { type: Boolean },
});
productSchema.plugin(mongoosePaginate);

export const ProductModel = model(productCollection, productSchema);
