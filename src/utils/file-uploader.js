import multer from "multer";

import { __dirname } from "../utils.js";
import { validateUserDocumentPayload } from "../middlewares/validation/user.validator.js";

async function fileFilter(req, file, cb) {
  try {
    validateUserDocumentPayload(req);

    cb(null, true);
  } catch (error) {
    cb(error);
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/files/documents/`);
  },

  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").slice(-1);

    cb(null, `${req.params.uid}:${req.body.document_type}.${ext}`);
  },
});

export const userDocumentUploader = multer({
  fileFilter,
  storage,

  onError: function (err, next) {
    next(err);
  },
});
