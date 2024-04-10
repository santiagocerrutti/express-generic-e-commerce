import { Schema, model, Types } from "mongoose";

export const messageCollection = "messages";

export const messageSchema = new Schema(
  {
    _id: {
      type: Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    user: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const MessageModel = model(messageCollection, messageSchema);
