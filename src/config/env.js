/* eslint-disable no-undef */
/** @see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import */
import * as dotenv from "dotenv";

import { ENV_OPTION, program } from "../utils.js";

const { mode } = program.opts();

const envPaths = {
  [ENV_OPTION.DEV]: process.cwd() + "/.env.dev",
  [ENV_OPTION.STAGE]: process.cwd() + "/.env.stage",
  [ENV_OPTION.PROD]: process.cwd() + "/.env.prod",
};

dotenv.config({
  path: envPaths[mode],
});

export const env = {
  //TODO: sería bueno que las base de datos de aplicación y de sesión sean distintas
  // Revisar cómo hacer para conectarnos a otra BD desde los manager.
  NODE_ENV: mode,
  MONGO_URL:
    process.env.MONGO_URL ||
    "mongodb+srv://user:password@coderhousecluster.q3o8n6f.mongodb.net/db_name?retryWrites=true&w=majority",
  PORT: parseInt(process.env.PORT) || 8080,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "adminCoder@coder.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "adminCod3r123",
  COOKIE_SECRET: process.env.COOKIE_SECRET || "sha-256_hash_here",
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
