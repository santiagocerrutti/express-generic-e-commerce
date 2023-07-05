/* eslint-disable no-unused-vars */

export class UserDaoFile {
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
    throw new Error("Not implemented yet.");
  }

  async updateOne(objectId, fieldsToUpdate) {
    throw new Error("Not implemented yet.");
  }

  async deleteOne(productId) {
    throw new Error("Not implemented yet.");
  }
}
