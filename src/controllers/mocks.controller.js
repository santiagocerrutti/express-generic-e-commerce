import { mockInitFake, mockInitAdmin } from "../use-cases/mock.use-cases.js";

class MocksController {
  constructor() {}

  mockInitAdmin = async (req, res, next) => {
    try {
      const result = await mockInitAdmin();

      res.sendCreated(result);
    } catch (error) {
      next(error);
    }
  };

  mockInitFake = async (req, res, next) => {
    try {
      const result = await mockInitFake();

      res.sendCreated(result);
    } catch (error) {
      next(error);
    }
  };
}

export const mocksController = new MocksController();
