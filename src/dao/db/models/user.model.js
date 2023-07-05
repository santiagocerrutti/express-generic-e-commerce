import MUUID from "uuid-mongodb";
import { Schema, model } from "mongoose";

import { cartCollection } from "./cart.model.js";

export const userCollection = "users";

export const userSchema = new Schema(
  {
    _id: { type: "object", value: { type: "Buffer" }, default: MUUID.v4() },
    first_name: { type: String, required: true },
    last_name: { type: String },
    email: { type: String, required: true, unique: true },
    date_of_birth: { type: Date },
    password: { type: String },
    cart: {
      type: "object",
      value: { type: "Buffer" },
      ref: cartCollection,
      required: false,
    },
    role: { type: String },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model(userCollection, userSchema);
