import { Router } from "./Router.js";
import { mocksController } from "../controllers/mocks.controller.js";

const { mockInit } = mocksController;

class MocksRouter extends Router {
  init() {
    this.get("/init", mockInit);
  }
}

export const mocksRouter = new MocksRouter().getRouter();
