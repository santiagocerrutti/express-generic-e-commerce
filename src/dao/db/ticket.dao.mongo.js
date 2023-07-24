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

  async getById(ticketId) {
    const foundTicket = await TicketModel.findById(MUUID.from(ticketId)).lean();

    return foundTicket;
  }

  async getOneByFilter(filterQuery) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async addOne(ticket) {
    return TicketModel.create(ticket);
  }

  async updateOne(objectId, fieldsToUpdate) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }

  async deleteOne(objectId) {
    throw new CustomError("Not implemented yet.", ERROR_CODE.NOT_IMPLEMENTED);
  }
}
