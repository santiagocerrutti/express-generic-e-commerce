/* eslint-disable no-unused-vars */
import MUUID from "uuid-mongodb";
import { TicketModel } from "./models/ticket.model.js";
import { CustomError, ERROR_CODE } from "../../utils.js";

export class TicketDaoMongo {
  constructor() {}
  async getAll(limit = 0) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async getAllPaginate(limit = 10, page = 1, query = {}, sort = undefined) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async getById(userId) {
    const foundTicket = await TicketModel.findById(MUUID.from(userId)).lean();

    return foundTicket;
  }

  async getOneByFilter(filterQuery) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async addOne(user) {
    return TicketModel.create(user);
  }

  async updateOne(objectId, fieldsToUpdate) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async deleteOne(productId) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }
}
