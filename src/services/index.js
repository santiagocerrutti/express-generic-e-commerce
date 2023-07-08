/* eslint-disable no-unused-vars */
import {
  CartDao,
  MessageDao,
  ProductDao,
  TicketDao,
  UserDao,
} from "../dao/factory.js";
import { Repository } from "../repository/index.js";

export const cartsService = new Repository(new CartDao());

export const messagesService = new Repository(new MessageDao());

export const productsService = new Repository(new ProductDao());

export const usersService = new Repository(new UserDao());

export const ticketsService = new Repository(new TicketDao());
