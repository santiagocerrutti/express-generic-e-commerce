import multer from "multer";
import { validateUserDocumentPayload } from "../use-cases/user.use-cases.js";
import { __dirname } from "../utils.js";

async function fileFilter(req, file, cb) {
  try {
    validateUserDocumentPayload(req);

    cb(null, true);
  } catch (error) {
    cb(error);
  }
}

/**
 * This is to store files on Server Filesystem
 * To save files in other locations StoreEngine must be implemented
 * @see https://github.com/expressjs/multer/blob/master/StorageEngine.md
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/files/documents/`);
  },

  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").slice(-1);

    cb(null, `${req.params.uid}:${req.body.document_type}.${ext}`);
  },
});

/**
 * Middleware to receive user document
 */
export const userDocumentUploader = multer({
  fileFilter,
  storage,

  onError: function (err, next) {
    next(err);
  },
}).single("document");
