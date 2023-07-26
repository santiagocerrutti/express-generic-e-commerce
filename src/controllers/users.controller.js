import { switchUserToPremium } from "../use-cases/user.use-cases.js";

class UsersController {
  constructor() {}

  switchUserToPremium = async (req, res, next) => {
    const { uid } = req.params;

    try {
      const result = await switchUserToPremium(uid);

      res.sendSuccess(result);
    } catch (error) {
      next(error);
    }
  };
}

export const usersController = new UsersController();
