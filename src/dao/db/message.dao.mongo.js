/* eslint-disable no-unused-vars */
import { MessageModel } from "./models/message.model.js";
import { CustomError, ERROR_CODE } from "../../utils.js";
import { Types } from "mongoose";

export class MessageDaoMongo {
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

  async getById(objectId) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async getOneByFilter(filterQuery) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async addOne(message) {
    const newMessage = await MessageModel.create({
      /** This is a fix for duplicate id ¿? */
      _id: new Types.ObjectId(),
      ...message,
    });

    return newMessage;
  }

  async addMany(arrayOfObjects) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async updateOne(objectId, fieldsToUpdate) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async deleteOne(productId) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }
}
