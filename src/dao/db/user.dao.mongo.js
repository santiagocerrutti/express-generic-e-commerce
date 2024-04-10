/* eslint-disable no-unused-vars */
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
    const foundUser = await UserModel.findById(userId).lean();

    return foundUser;
  }

  async getOneByFilter(filterQuery) {
    const foundUser = await UserModel.findOne(filterQuery).lean();

    return foundUser;
  }

  async addOne(user) {
    return await UserModel.create(user);
  }

  async addMany(users) {
    return await UserModel.insertMany(users);
  }

  async updateOne(userId, fieldsToUpdate) {
    let result = null;
    try {
      result = await UserModel.findOneAndUpdate(
        {
          _id: userId,
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
      const updatedUser = await UserModel.findById(userId);

      return updatedUser;
    }

    return null;
  }

  async deleteOne(userId) {
    return UserModel.findOneAndDelete({
      _id: userId,
    });
  }
}
