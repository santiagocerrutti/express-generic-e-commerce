/* eslint-disable no-unused-vars */
export class MessageRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async addMessage(message) {
    this.dao.addMessage(message);
  }
}
