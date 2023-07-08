/* eslint-disable no-unused-vars */
import MUUID from "uuid-mongodb";
import { TicketModel } from "./models/ticket.model.js";

export class TicketDaoMongo {
  constructor() {}
  async getAll(limit = 0) {
    throw new Error("Not implemented yet.");
  }

  async getAllPaginate(limit = 10, page = 1, query = {}, sort = undefined) {
    throw new Error("Not implemented yet.");
  }

  async getById(userId) {
    const foundTicket = await TicketModel.findById(MUUID.from(userId)).lean();

    return foundTicket;
  }

  async getOneByFilter(filterQuery) {
    throw new Error("Not implemented yet.");
  }

  async addOne(user) {
    return TicketModel.create(user);
  }

  async updateOne(objectId, fieldsToUpdate) {
    throw new Error("Not implemented yet.");
  }

  async deleteOne(productId) {
    throw new Error("Not implemented yet.");
  }
}
