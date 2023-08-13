import { Schema, model } from "mongoose";
/** @see https://www.npmjs.com/package/uuid-mongodb */
import MUUID from "uuid-mongodb";
import { userCollection } from "./user.model.js";

MUUID.mode("relaxed");

export const passwordRecoveryTokenCollection = "password_recovery_tokens";

export const passwordRecoveryTokenSchema = new Schema({
  _id: { type: "object", value: { type: "Buffer" }, default: () => MUUID.v4() },
  user: {
    type: "object",
    value: { type: "Buffer" },
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
