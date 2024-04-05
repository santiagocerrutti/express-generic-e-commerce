import bcrypt from "bcrypt";
import { Command, Option } from "commander";
import jwt from "jsonwebtoken";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

/**
 * Deletes undefined properties from an object.
 *
 * @param {Object} obj - The object to remove undefined properties from.
 * @returns {Object} - A new object with the undefined properties removed.
 */
export function deleteUndefinedProperties(obj) {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === undefined) {
      delete newObj[key];
    }
  });

  return newObj;
}

/**
 * Generates a hash for the given password using bcrypt.
 *
 * @param {string} password - The password to be hashed.
 * @returns {Promise<string>} - A promise that resolves to the hashed password.
 */
export async function createHash(password) {
  const salt = await bcrypt.genSalt(env.HASH_SALT_ROUNDS);

  return bcrypt.hashSync(password, salt);
}

/**
 * Check if a password is valid by comparing it with a hashed password.
 *
 * @param {string} password - The password to be checked.
 * @param {string} hash - The hashed password to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to true if the password is valid, and false otherwise.
 */
export async function isValidPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Generates a signed JWT with user data in it
 * @param user payload to save in JWT
 * @inner
 */
function generateJwt(user) {
  return jwt.sign({ user }, env.JWT_SECRET, { expiresIn: "1h" });
}

export const cookieConfig = {
  maxAge: 60 * 60 * 1000, // 1 hour
  httpOnly: true, //* esto es para que la cookie no sea accesible desde el browser, sino solo al enviar peticiones http
};

/**
 * Generates a JSON Web Token (JWT) for the given user.
 *
 * @param {Object} user - The user object.
 * @returns {string} - The generated JWT.
 */
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
  BUSINESS_LOGIC_ERROR: "BUSINESS_LOGIC_ERROR",
  NOT_FOUND: "NOT_FOUND",
  NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
  DUPLICATED_KEY: "DUPLICATED_KEY",
  INVALID_BODY: "INVALID_BODY",
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
  NOT_AUTHENTICATED: "NOT_AUTHENTICATED",
  UNCAUGHT_ERROR: "UNCAUGHT_ERROR",
};

/**
 * CustomError class represents a custom error object.
 *
 * @class
 * @extends Error
 *
 * @param {string} message - The error message.
 * @param {number} code - The error code.
 * @param {Array} errors - Additional errors associated with the error.
 *
 * @property {number} code - The error code.
 * @property {Array} errors - Additional errors associated with the error.
 */
export class CustomError extends Error {
  constructor(message, code, errors = []) {
    super(message);
    this.code = code;
    this.errors = errors;
  }
}
