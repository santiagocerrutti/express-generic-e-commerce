/* eslint-disable no-undef */
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

export const env = {
  //TODO: sería bueno que las base de datos de aplicación y de sesión sean distintas
  // Revisar cómo hacer para conectarnos a otra BD desde los manager.
  MONGO_URL: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@coderhousecluster.q3o8n6f.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`,
  PORT: parseInt(process.env.PORT) || 8080,
  COOKIE_SECRET: process.env.SECRET || "sha-256_hash_here",
  HOST_URL: process.env.HOST_URL || "http://localhost:8080",
  HASH_SALT_ROUNDS: parseInt(process.env.HASH_SALT_ROUNDS) || 10,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || "",
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || "",
  GITHUB_CALLBACK_URL:
    process.env.GITHUB_CALLBACK_URL ||
    "http://localhost:8080/sessions/github-callback",
  JWT_SECRET: process.env.JWT_SECRET || "sha-256_hash_here",
  JWT_COOKIE_NAME: process.env.JWT_COOKIE_NAME || "AuthJwt",
};
