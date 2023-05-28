import MUUID from "uuid-mongodb";
import { createHash } from "../../utils.js";
import { UserModel } from "./models/user.model.js";

export class UserManager {
  constructor() {}
  async createUser(user) {
    try {
      const password = await createHash(user.password);
      const newUser = await UserModel.create({
        ...user,
        password,
      });

      return newUser;
    } catch (error) {
      const e = new Error(`Email ${user.email} duplicated`);
      e.code = "DUPLICATED_KEY";

      throw e;
    }
  }

  async getUserByEmail(email) {
    const foundUser = await UserModel.findOne({ email }).lean();

    return foundUser;
  }

  async findById(userId) {
    const foundUser = await UserModel.findById(MUUID.from(userId)).lean();

    return foundUser;
  }
}
