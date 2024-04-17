import { faker } from "@faker-js/faker";
import {
  cartsService,
  productsService,
  usersService,
} from "../services/index.js";
import { createHash } from "../utils.js";
import { env } from "../config/env.js";
import { purchaseCart } from "./cart.use-cases.js";

async function createAdminUser() {
  const existingAdmin = await usersService.getOneByFilter({
    email: env.ADMIN_EMAIL,
  });

  if (existingAdmin) return existingAdmin;

  const admin = {
    _id: faker.database.mongodbObjectId(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: env.ADMIN_EMAIL,
    date_of_birth: faker.date.birthdate(),
    role: "admin",
    password: await createHash(env.ADMIN_PASSWORD),
    last_connection: faker.date.past(),
    deleted: false,
  };

  const result = await usersService.addOne(admin);

  return { ...result._doc, password: env.ADMIN_PASSWORD };
}

async function createPremiumUser() {
  const password = faker.internet.password();
  const first_name = faker.person.firstName();
  const last_name = faker.person.lastName();
  const admin = {
    _id: faker.database.mongodbObjectId(),
    first_name,
    last_name,
    email: `${first_name[0]}.${last_name}@gmail.com`.toLocaleLowerCase(),
    date_of_birth: faker.date.birthdate(),
    role: "premium",
    password: await createHash(password),
    documents: [
      {
        name: "service_bill",
        document_type: "proof_of_address",
        reference: faker.internet.url(),
      },
      {
        name: "account_extract",
        document_type: "account_statement",
        reference: faker.internet.url(),
      },
      {
        name: "id",
        document_type: "identification",
        reference: faker.internet.url(),
      },
    ],
    last_connection: faker.date.past(),
    deleted: false,
  };

  const result = await usersService.addOne(admin);

  return { ...result._doc, password };
}

async function createCommonUser() {
  const password = faker.internet.password();
  const first_name = faker.person.firstName();
  const last_name = faker.person.lastName();
  const admin = {
    _id: faker.database.mongodbObjectId(),
    first_name,
    last_name,
    email: `${first_name[0]}.${last_name}@gmail.com`.toLocaleLowerCase(),
    date_of_birth: faker.date.birthdate(),
    role: "user",
    password: await createHash(password),
    last_connection: faker.date.past(),
    deleted: false,
  };

  const result = await usersService.addOne(admin);

  return { ...result._doc, password };
}

async function createProducts(ownerUserId) {
  const productsToAdd = [];

  for (let index = 0; index < 20; index++) {
    productsToAdd.push({
      _id: faker.database.mongodbObjectId(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      code: faker.string.uuid(),
      price: faker.commerce.price(),
      status: true,
      stock: faker.number.int({
        max: 100,
        min: 10,
      }),
      category: faker.commerce.product(),
      thumbnails: [
        faker.image.urlLoremFlickr({
          category: "food",
        }),
      ],
      owner: ownerUserId,
      deleted: false,
    });
  }

  const result = await productsService.addMany(productsToAdd);

  return result;
}

async function createCart(ownerUser, products) {
  const newCart = await cartsService.addOne({
    _id: faker.database.mongodbObjectId(),
    products: [
      {
        product: products[Math.floor(Math.random() * products.length)],
        quantity: faker.number.int({
          max: 5,
          min: 1,
        }),
      },
      {
        product: products[Math.floor(Math.random() * products.length)],
        quantity: faker.number.int({
          max: 5,
          min: 1,
        }),
      },
    ],
  });

  await usersService.updateOne(ownerUser._id, {
    cart: newCart._id,
  });

  return newCart;
}

async function createPurchasedCart(ownerUser, products) {
  const cart = await cartsService.addOne({
    _id: faker.database.mongodbObjectId(),
    products: [
      {
        product: products[Math.floor(Math.random() * products.length)],
        quantity: faker.number.int({
          max: 5,
          min: 1,
        }),
      },
    ],
  });

  const ticket = await purchaseCart(cart._id, ownerUser);

  return {
    cart,
    ticket,
  };
}

/**
 * Initializes the mock admin user.
 *
 * This function creates an admin user if one does not already exist in the database.
 * The admin user is created with randomly generated data using the faker library.
 *
 * @returns {Object} An object containing the admin user.
 * @throws {Error} If there is an error creating the admin user.
 */
export async function mockInitAdmin() {
  const admin = await createAdminUser();

  return {
    users: [admin],
  };
}

/**
 * Initializes the mock data for testing purposes.
 *
 * This function creates an admin user, a premium user, and a common user.
 * It also creates a list of products associated with the premium user.
 * Additionally, it creates a purchased cart and a regular cart for the common user.
 *
 * @returns {Object} - An object containing the generated mock data.
 *   - users: An array of user objects, including the premium, and common users.
 *   - products: An array of product objects associated with the premium user.
 *   - carts: An array of cart objects, including the purchased cart and the regular cart.
 *   - tickets: An array of ticket objects associated with the purchased cart.
 *
 * @throws {Error} - If an error occurs during the mock data generation process.
 */
export async function mockInitFake() {
  const premium = await createPremiumUser();
  const common = await createCommonUser();

  const products = await createProducts(premium._id);
  const { cart: purchasedCart, ticket } = await createPurchasedCart(
    common,
    products
  );

  const cart = await createCart(common, products);

  return {
    users: [premium, common],
    products,
    carts: [purchasedCart, cart],
    tickets: [ticket],
  };
}
