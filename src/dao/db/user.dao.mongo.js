/* eslint-disable no-unused-vars */
import MUUID from "uuid-mongodb";
import { UserModel } from "./models/user.model.js";
import { CustomError, ERROR_CODE } from "../../utils.js";

export class UserDaoMongo {
  constructor() {}

  async getAll(limit = 0) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async getAllPaginate(limit = 10, page = 1, query = {}, sort = undefined) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
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
      throw new CustomError(
        `Code ${fieldsToUpdate.code} duplicated`,
        ERROR_CODE.DUPLICATED_KEY
      );
    }

    if (result) {
      const updatedUser = await UserModel.findById(MUUID.from(userId));

      return updatedUser;
    }

    return null;
  }

  async deleteOne(productId) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }
}
