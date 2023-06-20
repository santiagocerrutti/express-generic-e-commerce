import MUUID from "uuid-mongodb";
import { MessageModel } from "./models/message.model.js";

export class MessageDaoMongo {
  constructor() {}

  async addMessage(message) {
    const newMessage = await MessageModel.create({
      /** This is a fix for duplicate id ¿? */
      _id: MUUID.v4(),
      ...message,
    });

    return newMessage;
  }
}
