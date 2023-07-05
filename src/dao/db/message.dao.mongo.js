/* eslint-disable no-unused-vars */
import MUUID from "uuid-mongodb";
import { MessageModel } from "./models/message.model.js";

export class MessageDaoMongo {
  constructor() {}

  async getAll(limit = 0) {
    throw new Error("Not implemented yet.");
  }

  async getAllPaginate(limit = 10, page = 1, query = {}, sort = undefined) {
    throw new Error("Not implemented yet.");
  }

  async getById(objectId) {
    throw new Error("Not implemented yet.");
  }

  async getOneByFilter(filterQuery) {
    throw new Error("Not implemented yet.");
  }

  async addOne(message) {
    const newMessage = await MessageModel.create({
      /** This is a fix for duplicate id ¿? */
      _id: MUUID.v4(),
      ...message,
    });

    return newMessage;
  }

  async updateOne(objectId, fieldsToUpdate) {
    throw new Error("Not implemented yet.");
  }

  async deleteOne(productId) {
    throw new Error("Not implemented yet.");
  }
}
