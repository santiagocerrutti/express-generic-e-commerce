import { Schema, model, Types } from "mongoose";
import { userCollection } from "./user.model.js";

export const passwordRecoveryTokenCollection = "password_recovery_tokens";

export const passwordRecoveryTokenSchema = new Schema({
  _id: {
    type: Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  user: {
    type: Types.ObjectId,
    ref: userCollection,
    required: false,
  },
  issued_at: { type: Date, required: true, default: Date.now },
  expired_at: { type: Date, required: true },
});

export const PasswordRecoveryTokenModel = model(
  passwordRecoveryTokenCollection,
  passwordRecoveryTokenSchema
);
