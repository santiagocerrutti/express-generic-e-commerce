import { createTransport } from "nodemailer";
import { env } from "../config/env.js";

const transport = createTransport({
  service: env.EMAIL_SERVICE,
  port: env.EMAIL_PORT,
  auth: {
    user: env.EMAIL_ADDRESS,
    pass: env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (destinationEmail, subject, htmlBody) => {
  return await transport.sendMail({
    from: `Email services <${env.EMAIL_ADDRESS}>`,
    to: destinationEmail,
    subject,
    html: htmlBody,
  });
};
