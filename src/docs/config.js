import { __dirname } from "../utils.js";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "E-commerce",
      description: "Generic Ecommerce (*Coderhouse)",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};
