import { CartDao, MessageDao, ProductDao, UserDao } from "../dao/factory.js";
import {
  CartRepository,
  MessageRepository,
  ProductRepository,
  UserRepository,
} from "../repository/index.js";

export const cartsService = new CartRepository(new CartDao());

export const messagesService = new MessageRepository(new MessageDao());

export const productsService = new ProductRepository(new ProductDao());

export const usersService = new UserRepository(new UserDao());
