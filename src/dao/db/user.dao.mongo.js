/* eslint-disable no-unused-vars */
import MUUID from "uuid-mongodb";
import { UserModel } from "./models/user.model.js";

export class UserDaoMongo {
  constructor() {}

  async getAll(limit = 0) {
    throw new Error("Not implemented yet.");
  }

  async getAllPaginate(limit = 10, page = 1, query = {}, sort = undefined) {
    throw new Error("Not implemented yet.");
  }

  async getById(userId) {
    const foundUser = await UserModel.findById(MUUID.from(userId)).lean();

    return foundUser;
  }

  async getOneByFilter(filterQuery) {
    const foundUser = await UserModel.findOne(filterQuery).lean();

    return foundUser;
  }

  async addOne(user) {
    await UserModel.create(user);
  }

  async updateOne(userId, fieldsToUpdate) {
    let result = null;
    try {
      result = await UserModel.findOneAndUpdate(
        {
          _id: MUUID.from(userId),
        },
        { ...fieldsToUpdate }
      );
    } catch (error) {
      const e = new Error(`Code ${fieldsToUpdate.code} duplicated`);
      e.code = "DUPLICATED_KEY";

      throw e;
    }

    if (result) {
      const updatedUser = await UserModel.findById(MUUID.from(userId));

      return updatedUser;
    }

    return null;
  }

  async deleteOne(productId) {
    throw new Error("Not implemented yet.");
  }
}
