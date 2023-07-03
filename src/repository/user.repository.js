/* eslint-disable no-unused-vars */

export class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async createUser(user) {
    return this.dao.createUser(user);
  }

  async getUserByEmail(email) {
    return this.dao.getUserByEmail(email);
  }

  async findById(userId) {
    return this.dao.findById(userId);
  }
}
