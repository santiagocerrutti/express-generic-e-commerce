/** @see https://www.npmjs.com/package/uuid-mongodb */
import MUUID from "uuid-mongodb";
import { Schema, model } from "mongoose";

MUUID.mode("relaxed");

export const messageCollection = "messages";

export const messageSchema = new Schema(
  {
    _id: {
      type: "object",
      value: { type: "Buffer" },
      default: () => MUUID.v4(),
    },
    user: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const MessageModel = model(messageCollection, messageSchema);
