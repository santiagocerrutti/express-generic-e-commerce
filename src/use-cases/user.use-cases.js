import { createHash } from "../utils.js";
import { usersService } from "../services/index.js";

export async function createUser(user) {
  try {
    const hashedPassword = user.password
      ? await createHash(user.password)
      : null;

    await usersService.addOne({
      ...user,
      password: hashedPassword,
    });

    return usersService.getOneByFilter({ email: user.email });
  } catch (error) {
    console.log(error);
    const e = new Error(`Email ${user.email} duplicated`);
    e.code = "DUPLICATED_KEY";

    throw e;
  }
}

export async function getUserByEmail(email) {
  const foundUser = await usersService.getOneByFilter({ email });

  return foundUser;
}

export async function findUserById(userId) {
  const foundUser = await usersService.getById(userId);

  return foundUser;
}
