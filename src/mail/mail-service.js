import { createTransport } from "nodemailer";
import { env } from "../config/env.js";

const transport = createTransport({
  service: env.EMAIL_SERVICE,
  port: env.EMAIL_PORT,
  auth: {
    user: env.EMAIL_ADDRESS,
    /** For Gmail configuration @see https://support.google.com/accounts/answer/185833 */
    pass: env.EMAIL_PASSWORD,
  },
});

/**
 * Sends an email using the configured email service.
 *
 * @param {string} destinationEmail - The email address of the recipient.
 * @param {string} subject - The subject of the email.
 * @param {string} htmlBody - The HTML content of the email body.
 * @returns {Promise} - A promise that resolves when the email is sent successfully.
 */
export const sendEmail = async (destinationEmail, subject, htmlBody) => {
  return await transport.sendMail({
    from: `Email services <${env.EMAIL_ADDRESS}>`,
    to: destinationEmail,
    subject,
    html: htmlBody,
  });
};
