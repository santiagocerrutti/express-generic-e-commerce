/* eslint-disable no-unused-vars */
import { CustomError, ERROR_CODE } from "../../utils.js";

export class PasswordRecoveryTokenDaoFile {
  constructor() {}
  async getAll(limit = 0) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async getAllPaginate(limit = 10, page = 1, query = {}, sort = undefined) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async getById(tokenId) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async getOneByFilter(filterQuery) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async addOne(token) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async updateOne(objectId, fieldsToUpdate) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async deleteOne(tokenId) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }
}
