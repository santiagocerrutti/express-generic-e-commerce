import { __dirname } from "../utils.js";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Express Generic E-commerce",
      description:
        "Server Application to manage and purchase products. It provides a full platform to create, update and delete products and to create a shopping cart selecting products and purchase them. The application is secured by JWT mechanism and has features for admin, premium and common users.",
    },
  },
  /**
   * TODO: documentar el código con la anotación @openapi en los controllers para que la generación del swagger sea automática.
   * @see https://www.npmjs.com/package/swagger-jsdoc
   */
  apis: [`${__dirname}/docs/**/*.yaml`],
};
