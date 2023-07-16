import { Router } from "./Router.js";

class TestRouter extends Router {
  init() {
    // eslint-disable-next-line no-unused-vars
    this.get("/logger", (req, res, next) => {
      req.logger.error("THIS ERROR IS ONLY FOR TESTING PURPORSES");

      res.sendSuccess();
    });
  }
}

export const testRouter = new TestRouter().getRouter();
