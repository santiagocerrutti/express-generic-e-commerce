import bcrypt from "bcrypt";
import { Command, Option } from "commander";
import jwt from "jsonwebtoken";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export function deleteUndefinedProperties(obj) {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === undefined) {
      delete newObj[key];
    }
  });

  return newObj;
}

export async function createHash(password) {
  const salt = await bcrypt.genSalt(env.HASH_SALT_ROUNDS);

  return bcrypt.hashSync(password, salt);
}

export async function isValidPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function generateJwt(user) {
  return jwt.sign({ user }, env.JWT_SECRET, { expiresIn: "1h" });
}

export const cookieConfig = {
  maxAge: 60 * 60 * 1000, // 1 hour
  httpOnly: true, // esto es para que la cookie no sea accesible desde el browser, sino solo al enviar peticiones http
};

export function createTokenFromUser(user) {
  delete user["password"];

  return generateJwt({
    ...user,
  });
}

export const ENV_OPTION = {
  LOCAL: "local",
  DEV: "development",
  STAGE: "stage",
  PROD: "production",
};

export const program = new Command()
  .addOption(
    new Option("--mode <mode>", "Environment").choices([
      ENV_OPTION.LOCAL,
      ENV_OPTION.DEV,
      ENV_OPTION.STAGE,
      ENV_OPTION.PROD,
    ])
  )
  .parse();

export const ERROR_CODE = {
  NOT_FOUND: "NOT_FOUND",
  NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
  DUPLICATED_KEY: "DUPLICATED_KEY",
  INVALID_BODY: "INVALID_BODY",
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
  NOT_AUTHENITCATED: "NOT_AUTHENITCATED",
};

export class CustomError extends Error {
  constructor(message, code, errors = []) {
    super(message);
    this.code = code;
    this.errors = errors;
  }
}
