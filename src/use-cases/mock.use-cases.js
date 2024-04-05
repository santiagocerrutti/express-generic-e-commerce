import { faker } from "@faker-js/faker";
import { productsService } from "../services/index.js";

/**
 * Generates and adds mock products to the database.
 *
 * @returns {Promise} A promise that resolves with the result of adding the mock products.
 */
export async function mockProducts() {
  const productsToAdd = [];
  for (let index = 0; index < 10; index++) {
    productsToAdd.push({
      _id: faker.string.uuid(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      code: faker.string.uuid(),
      price: faker.commerce.price(),
      status: true,
      stock: faker.number.int({
        max: 100,
        min: 0,
      }),
      category: faker.commerce.product(),
      thumbnails: [faker.image.urlLoremFlickr()],
    });
  }

  const result = await productsService.addMany(productsToAdd);

  return result;
}
