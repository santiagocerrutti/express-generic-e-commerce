import { mockInit } from "../use-cases/mock.use-cases.js";

class MocksController {
  constructor() {}

  mockInit = async (req, res, next) => {
    try {
      const result = await mockInit(req.body);

      res.sendCreated(result);
    } catch (error) {
      next(error);
    }
  };
}

export const mocksController = new MocksController();
