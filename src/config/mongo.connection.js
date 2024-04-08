import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "./logger.js";

export class MongoConnection {
  static _instance = null;

  constructor() {
    this.connect();
  }

  async connect() {
    logger.info("connecting to mongo...");
    await mongoose.connect(env.MONGO_URL);
    logger.info("connected to mongo!");
  }

  static getInstance() {
    if (!MongoConnection._instance) {
      MongoConnection._instance = new MongoConnection();
    }

    return MongoConnection._instance;
  }
}
