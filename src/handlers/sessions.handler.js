import { env } from "../config/env.js";
import { generateJwt } from "../utils.js";

export const cookieConfig = {
  maxAge: 60 * 60 * 1000, // 1 hour
  httpOnly: true, // esto es para que la cookie no sea accesible desde el browser, sino solo al enviar peticiones http
};

export function createTokenFromUser(user) {
  delete user["password"];
  const role = user.email === "santiago@encina.com" ? "admin" : "user";

  return generateJwt({
    ...user,
    role,
  });
}

export async function postRegisterHandler(req, res) {
  const { user } = req;

  if (user) {
    res
      .status(201)
      .send({ status: "SUCCESS", message: "User created successfully" });

    return;
  }

  res.status(401).send({ status: "ERROR", error: "Invalid User" });
}

export async function postLoginHandler(req, res) {
  const { user } = req;

  if (user) {
    const token = createTokenFromUser(user);

    res
      .cookie(env.JWT_COOKIE_NAME, token, cookieConfig)
      .status(200)
      .send({ status: "SUCCESS", message: "Login successfull" });

    return;
  }

  res.status(401).send({ status: "ERROR", error: "Invalid User" });
}

export async function postLogoutHandler(req, res) {
  try {
    res.clearCookie(env.JWT_COOKIE_NAME);
    res.status(200).send({ status: "SUCCESS", message: "Logout successfull." });

    return;
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "ERROR", error: "Internal Server Error" });
  }
}

export async function getCurrentHandler(req, res) {
  res.status(200).send({ payload: req.user });
}
