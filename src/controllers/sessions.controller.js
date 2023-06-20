import { env } from "../config/env.js";
import { generateJwt } from "../utils.js";

export const cookieConfig = {
  maxAge: 60 * 60 * 1000, // 1 hour
  httpOnly: true, // esto es para que la cookie no sea accesible desde el browser, sino solo al enviar peticiones http
};

export function createTokenFromUser(user) {
  delete user["password"];
  const role = user.email === env.ADMIN_EMAIL ? "admin" : "user";

  return generateJwt({
    ...user,
    role,
  });
}

export async function register(req, res) {
  const { user } = req;

  if (user) {
    res.sendCreated("User created successfully");

    return;
  }

  res.sendNotAutenticated("Invalid User");
}

export async function login(req, res) {
  const { user } = req;

  if (user) {
    const token = createTokenFromUser(user);

    res.cookie(env.JWT_COOKIE_NAME, token, cookieConfig);
    res.sendSuccess("Login successfull");

    return;
  }

  res.sendNotAutenticated("Invalid User");
}

export async function logout(req, res) {
  try {
    res.clearCookie(env.JWT_COOKIE_NAME);
    res.sendSuccess("Logout successfull.");

    return;
  } catch (error) {
    console.log(error);
    res.sendInternalServerError();
  }
}

export async function getCurrent(req, res) {
  res.sendSuccess(req.user);
}
