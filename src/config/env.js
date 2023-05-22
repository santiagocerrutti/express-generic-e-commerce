/* eslint-disable no-undef */
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

export const env = {
  //TODO: sería bueno que las base de datos de aplicación y de sesión sean distintas
  // Revisar cómo hacer para conectarnos a otra BD desde los manager.
  MONGO_URL: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@coderhousecluster.q3o8n6f.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`,
  PORT: parseInt(process.env.PORT) || 8080,
  SECRET: process.env.SECRET || "sha-256_hash_here",
  HOST_URL: process.env.HOST_URL || "http://localhost:8080",
};
