import { messagesService } from "../services/index.js";

export async function addMessage(message) {
  const newMessage = await messagesService.addOne(message);

  return newMessage;
}
