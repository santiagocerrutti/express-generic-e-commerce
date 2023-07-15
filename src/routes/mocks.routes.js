import {
  ROLES,
  isAuthenticated,
  isAuthorized,
} from "../middlewares/auth/index.js";
import { Router } from "./Router.js";
import { mocksController } from "../controllers/mocks.controller.js";

const { mockProducts } = mocksController;

class MocksRouter extends Router {
  init() {
    this.get(
      "/products",
      isAuthenticated,
      isAuthorized(ROLES.ADMIN),
      mockProducts
    );
  }
}

export const mocksRouter = new MocksRouter().getRouter();
