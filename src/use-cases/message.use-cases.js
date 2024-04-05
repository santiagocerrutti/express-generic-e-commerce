import { messagesService } from "../services/index.js";

/**
 * Adds a new message to the messages service.
 *
 * @param {Object} message - The message to be added.
 * @returns {Promise<Object>} - A promise that resolves to the newly added message.
 */
export async function addMessage(message) {
  const newMessage = await messagesService.addOne(message);

  return newMessage;
}
