import { Schema, model, Types } from "mongoose";

export const userCollection = "users";

export const userSchema = new Schema(
  {
    _id: {
      type: Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    first_name: { type: String, required: true },
    last_name: { type: String },
    email: { type: String, required: true, unique: true },
    date_of_birth: { type: Date },
    password: { type: String },
    cart: {
      type: Types.ObjectId,
      ref: "carts",
      required: false,
    },
    role: { type: String, required: true },
    documents: { type: Array },
    last_connection: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model(userCollection, userSchema);
