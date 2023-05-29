import MUUID from "uuid-mongodb";
import { createHash } from "../../utils.js";
import { UserModel } from "./models/user.model.js";

export class UserManager {
  constructor() {}

  async createUser(user) {
    try {
      const hashedPassword = user.password
        ? await createHash(user.password)
        : null;

      await UserModel.create({
        ...user,
        password: hashedPassword,
      });

      return this.getUserByEmail(user.email);
    } catch (error) {
      console.log(error);
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
