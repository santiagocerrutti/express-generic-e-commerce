/* eslint-disable no-undef */
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

export const env = {
  MONGO_URL: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@coderhousecluster.q3o8n6f.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`,
  PORT: parseInt(process.env.PORT) || 8080,
  HOST_URL: process.env.HOST_URL || "http://localhost:8080",
};
