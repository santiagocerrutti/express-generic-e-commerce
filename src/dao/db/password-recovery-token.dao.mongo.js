/* eslint-disable no-unused-vars */
import { CustomError, ERROR_CODE } from "../../utils.js";
import { PasswordRecoveryTokenModel } from "./models/password-recovery-token.model.js";

export class PasswordRecoveryTokenDaoMongo {
  constructor() {}
  async getAll(limit = 0) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async getAllPaginate(limit = 10, page = 1, query = {}, sort = undefined) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async getAllByFilter(filterQuery) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async getById(tokenId) {
    const foundToken = await PasswordRecoveryTokenModel.findById(tokenId)
      .populate("user")
      .lean();

    return foundToken;
  }

  async getOneByFilter(filterQuery) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async addOne(token) {
    return PasswordRecoveryTokenModel.create(token);
  }

  async addMany(arrayOfObjects) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async updateOne(objectId, fieldsToUpdate) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async deleteOne(tokenId) {
    return PasswordRecoveryTokenModel.findOneAndDelete({
      _id: tokenId,
    });
  }
}
