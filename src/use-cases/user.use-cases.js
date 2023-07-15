import { CustomError, ERROR_CODE, createHash } from "../utils.js";
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

    throw new CustomError(
      `Email ${user.email} duplicated`,
      ERROR_CODE.DUPLICATED_KEY
    );
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
