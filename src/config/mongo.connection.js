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
    await mongoose.connect(this._buildUrl());
    logger.info("connected to mongo!");
  }

  _buildUrl() {
    let url = env.MONGO_PROTOCOL || "mongodb";
    url += "://";
    url +=
      env.MONGO_USER && env.MONGO_PASSWORD
        ? `${env.MONGO_USER}:${env.MONGO_PASSWORD}@`
        : "";
    url += `${env.MONGO_HOST}/${env.MONGO_DATABASE}`;
    url += env.MONGO_PARAMETERS ? `?${env.MONGO_PARAMETERS}` : "";

    return url;
  }

  static getInstance() {
    if (!MongoConnection._instance) {
      MongoConnection._instance = new MongoConnection();
    }

    return MongoConnection._instance;
  }
}
