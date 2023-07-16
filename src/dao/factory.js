import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { MongoConnection } from "../config/mongo.connection.js";
import {
  CartDaoMongo,
  MessageDaoMongo,
  ProductDaoMongo,
  TicketDaoMongo,
  UserDaoMongo,
} from "./db/index.js";
import {
  CartDaoFile,
  MessageDaoFile,
  ProductDaoFile,
  TicketDaoFile,
  UserDaoFile,
} from "./file/index.js";

let ProductDao;
let UserDao;
let MessageDao;
let CartDao;
let TicketDao;

switch (env.PERSISTENCE) {
  case "MONGO":
    MongoConnection.getInstance();
    ProductDao = ProductDaoMongo;
    UserDao = UserDaoMongo;
    MessageDao = MessageDaoMongo;
    CartDao = CartDaoMongo;
    TicketDao = TicketDaoMongo;
    break;
  case "FILE":
    logger.info("Using File Persistence");
    ProductDao = ProductDaoFile;
    UserDao = UserDaoFile;
    MessageDao = MessageDaoFile;
    CartDao = CartDaoFile;
    TicketDao = TicketDaoFile;
    break;
  default:
    break;
}

export { ProductDao, UserDao, MessageDao, CartDao, TicketDao };
