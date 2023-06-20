import mongoose from "mongoose";
import { env } from "./env.js";

export class MongoConnection {
  static _instance = null;

  constructor() {
    this.connect();
  }

  async connect() {
    console.log("conneting to mongo...");
    await mongoose.connect(env.MONGO_URL);
    console.log("conneted to mongo!");
  }

  static getInstance() {
    if (!MongoConnection._instance) {
      MongoConnection._instance = new MongoConnection();
    }

    return MongoConnection._instance;
  }
}
