/* eslint-disable no-unused-vars */
import {
  deleteInactiveUsers,
  getUsers,
  switchUserToPremium,
  uploadDocument,
} from "../use-cases/user.use-cases.js";

class UsersController {
  constructor() {}

  getUsers = async (req, res, next) => {
    try {
      const result = await getUsers();

      res.sendSuccess(result);
    } catch (error) {
      next(error);
    }
  };

  switchUserToPremium = async (req, res, next) => {
    const { uid } = req.params;

    try {
      const result = await switchUserToPremium(uid);

      res.sendSuccess(result);
    } catch (error) {
      next(error);
    }
  };

  uploadUserDocument = async (req, res, next) => {
    const { body, file, params } = req;

    try {
      await uploadDocument(params.uid, {
        name: body.name,
        document_type: body.document_type,
        reference: file.path,
      });

      res.sendSuccess("Document uploaded successfully");
    } catch (error) {
      next(error);
    }
  };

  deleteInactiveUsers = async (req, res, next) => {
    try {
      const result = await deleteInactiveUsers();

      res.sendSuccess(result);
    } catch (error) {
      next(error);
    }
  };
}

export const usersController = new UsersController();
