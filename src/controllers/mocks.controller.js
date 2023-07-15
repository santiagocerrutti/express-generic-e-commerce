import { mockProducts } from "../use-cases/mock.use-cases.js";

class MocksController {
  constructor() {}

  mockProducts = async (req, res, next) => {
    try {
      const result = await mockProducts(req.body);

      res.sendCreated(result);
    } catch (error) {
      next(error);
    }
  };
}

export const mocksController = new MocksController();
