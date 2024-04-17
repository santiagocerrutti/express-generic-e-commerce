import { Router } from "./Router.js";
import { mocksController } from "../controllers/mocks.controller.js";
import { ROLES, isAuthorized } from "../middlewares/auth/isAuthorized.js";

const { mockInit } = mocksController;

class MocksRouter extends Router {
  init() {
    this.get("/init", isAuthorized(ROLES.PUBLIC), mockInit);
  }
}

export const mocksRouter = new MocksRouter().getRouter();
