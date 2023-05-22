import { UserModel } from "./models/user.model.js";

export class UserManager {
  constructor() {}
  async createUser(user) {
    try {
      const newUser = await UserModel.create({ ...user });

      return newUser;
    } catch (error) {
      const e = new Error(`Email ${user.email} duplicated`);
      e.code = "DUPLICATED_KEY";

      throw e;
    }
  }

  async getUserByEmailAndPassword(email, password) {
    const foundUser = await UserModel.findOne({ email, password }).lean();
    console.log(foundUser);

    return foundUser;
  }
}
