import { Router } from "./Router.js";
import { mocksController } from "../controllers/mocks.controller.js";
import { ROLES, isAuthorized } from "../middlewares/auth/isAuthorized.js";

const { mockInitFake, mockInitAdmin } = mocksController;

class MocksRouter extends Router {
  init() {
    this.post("/init/admin", isAuthorized(ROLES.PUBLIC), mockInitAdmin);
    this.post("/init/fake", isAuthorized(ROLES.PUBLIC), mockInitFake);
  }
}

export const mocksRouter = new MocksRouter().getRouter();
