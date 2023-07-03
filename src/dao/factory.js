import { env } from "../config/env.js";
import { MongoConnection } from "../config/mongo.connection.js";
import {
  CartDaoMongo,
  MessageDaoMongo,
  ProductDaoMongo,
  UserDaoMongo,
} from "./db/index.js";
import {
  CartDaoFile,
  MessageDaoFile,
  ProductDaoFile,
  UserDaoFile,
} from "./file/index.js";

let ProductDao;
let UserDao;
let MessageDao;
let CartDao;

switch (env.PERSISTENCE) {
  case "MONGO":
    MongoConnection.getInstance();
    ProductDao = ProductDaoMongo;
    UserDao = UserDaoMongo;
    MessageDao = MessageDaoMongo;
    CartDao = CartDaoMongo;
    break;
  case "FILE":
    console.log("Using File Persistence");
    ProductDao = ProductDaoFile;
    UserDao = UserDaoFile;
    MessageDao = MessageDaoFile;
    CartDao = CartDaoFile;
    break;
  default:
    break;
}

export { ProductDao, UserDao, MessageDao, CartDao };
