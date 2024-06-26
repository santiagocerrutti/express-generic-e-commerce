import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { MongoConnection } from "../config/mongo.connection.js";
import {
  CartDaoMongo,
  MessageDaoMongo,
  ProductDaoMongo,
  TicketDaoMongo,
  UserDaoMongo,
  PasswordRecoveryTokenDaoMongo,
} from "./db/index.js";

import {
  CartDaoFile,
  MessageDaoFile,
  ProductDaoFile,
  TicketDaoFile,
  UserDaoFile,
  PasswordRecoveryTokenDaoFile,
} from "./file/index.js";

//* DAO is a pattern to encapsulate access logic to a table or collection
//* It's a pattern that has limitations vs Repository pattern
let ProductDao;
let UserDao;
let MessageDao;
let CartDao;
let TicketDao;
let PasswordRecoveryTokenDao;

//* This factory is used to switch persistence mechanism from envvars
switch (env.PERSISTENCE) {
  case "MONGO":
    MongoConnection.getInstance();
    ProductDao = ProductDaoMongo;
    UserDao = UserDaoMongo;
    MessageDao = MessageDaoMongo;
    CartDao = CartDaoMongo;
    TicketDao = TicketDaoMongo;
    PasswordRecoveryTokenDao = PasswordRecoveryTokenDaoMongo;
    break;
  case "FILE":
    logger.info("Using File Persistence");
    ProductDao = ProductDaoFile;
    UserDao = UserDaoFile;
    MessageDao = MessageDaoFile;
    CartDao = CartDaoFile;
    TicketDao = TicketDaoFile;
    PasswordRecoveryTokenDao = PasswordRecoveryTokenDaoFile;
    break;
  default:
    break;
}

export {
  ProductDao,
  UserDao,
  MessageDao,
  CartDao,
  TicketDao,
  PasswordRecoveryTokenDao,
};
