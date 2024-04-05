import dayjs from "dayjs";
import { logger } from "../config/logger.js";
import { newPasswordHtmlTemplate } from "../mail/email-templates.js";
import { sendEmail } from "../mail/mail-service.js";
import { ROLES } from "../middlewares/auth/isAuthorized.js";
import {
  passwordRecoveryTokenService,
  usersService,
} from "../services/index.js";
import {
  CustomError,
  ERROR_CODE,
  createHash,
  isValidPassword,
} from "../utils.js";

/**
 * Creates a new user.
 *
 * @param {Object} user - The user object.
 * @param {string} user.email - The email of the user.
 * @param {string} [user.password] - The password of the user.
 * @returns {Promise<Object>} - The newly created user object.
 * @throws {CustomError} - If the email is duplicated.
 */
export async function createUser(user) {
  try {
    const hashedPassword = user.password
      ? await createHash(user.password)
      : null;

    await usersService.addOne({
      ...user,
      password: hashedPassword,
    });

    return usersService.getOneByFilter({ email: user.email });
  } catch (error) {
    throw new CustomError(
      `Email ${user.email} duplicated`,
      ERROR_CODE.DUPLICATED_KEY
    );
  }
}

/**
 * Retrieves a user by their email address.
 *
 * @param {string} email - The email address of the user.
 * @returns {Promise<Object|null>} - A promise that resolves to the user object if found, or null if not found.
 */
export async function getUserByEmail(email) {
  const foundUser = await usersService.getOneByFilter({ email });

  return foundUser;
}

/**
 * Finds a user by their ID.
 *
 * @param {string} userId - The ID of the user to find.
 * @returns {Promise<Object>} - A promise that resolves to the found user object.
 */
export async function findUserById(userId) {
  const foundUser = await usersService.getById(userId);

  return foundUser;
}

/**
 * Updates the password of a user based on a password recovery token.
 *
 * @param {string} tokenId - The ID of the password recovery token.
 * @param {string} password - The new password to set for the user.
 * @returns {Promise<Object>} - A promise that resolves to the updated user object.
 * @throws {CustomError} - Throws a custom error if the token is not found, the token is expired, or the new password is the same as the current password.
 */
export async function updateUserPassword(tokenId, password) {
  const recoveryToken = await passwordRecoveryTokenService.getById(tokenId);

  if (recoveryToken) {
    if (dayjs().isBefore(recoveryToken.expired_at)) {
      if (!(await isValidPassword(password, recoveryToken.user.password))) {
        const result = await usersService.updateOne(recoveryToken.user._id, {
          password: await createHash(password),
        });

        await passwordRecoveryTokenService.deleteOne(tokenId);

        return result;
      }

      throw new CustomError(
        `New password must be different than current.`,
        ERROR_CODE.BUSINESS_LOGIC_ERROR
      );
    }

    throw new CustomError(
      `Current reset password token expired.`,
      ERROR_CODE.BUSINESS_LOGIC_ERROR
    );
  }

  throw new CustomError(`Token ${tokenId} not found.`, ERROR_CODE.NOT_FOUND);
}

/**
 * Sends a reset password email to the specified email address.
 *
 * @param {string} emailAddress - The email address of the user.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the recovery token.
 * @throws {CustomError} - If the user is not found or an uncaught error occurs.
 */
export async function sendResetPasswordEmail(emailAddress) {
  const user = await getUserByEmail(emailAddress);

  if (user) {
    try {
      const recoveryToken = await passwordRecoveryTokenService.addOne({
        user: user._id,
        issued_at: dayjs(),
        expired_at: dayjs().add(1, "hour"),
      });

      //! Non awaited Promises should execute code inside try-catch block.
      sendEmail(
        emailAddress,
        "Reset password request",
        newPasswordHtmlTemplate({
          name: user.first_name,
          token: recoveryToken._id,
        })
      );

      return {
        recoveryToken: recoveryToken._id,
      };
    } catch (error) {
      logger.error(error);

      throw new CustomError(error.message, ERROR_CODE.UNCAUGHT_ERROR);
    }
  }

  throw new CustomError(`User ${emailAddress} not found`, ERROR_CODE.NOT_FOUND);
}

/**
 * Validates the uploaded documents of a user.
 *
 * @param {Object} user - The user object.
 * @throws {CustomError} If the user has not uploaded the required documents.
 * @returns {void}
 */
function validateUploadedDocuments(user) {
  if (user.documents && user.documents.length) {
    const documentsTypes = user.documents.map((doc) => doc.document_type);

    console.log(documentsTypes);

    if (
      documentsTypes.includes("identification") &&
      documentsTypes.includes("account_statement") &&
      documentsTypes.includes("proof_of_address")
    ) {
      return;
    }
  }

  throw new CustomError(
    `User has not uploaded required documents`,
    ERROR_CODE.BUSINESS_LOGIC_ERROR
  );
}

/**
 * Switches a user to premium role.
 *
 * @param {string} uid - The ID of the user to switch.
 * @returns {Promise<Object>} - The updated user object.
 * @throws {CustomError} - If the user has not uploaded required documents.
 */
export async function switchUserToPremium(uid) {
  const user = await usersService.getById(uid);

  if (user?.role === ROLES.PREMIUM) {
    const result = await usersService.updateOne(uid, {
      role: ROLES.USER,
    });

    return result;
  }

  if (user?.role === ROLES.USER) {
    validateUploadedDocuments(user);
    const result = await usersService.updateOne(uid, {
      role: ROLES.PREMIUM,
    });

    return result;
  }

  return user;
}

/**
 * Retrieves a user by their ID.
 *
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the user object if found.
 * @throws {CustomError} - Throws a CustomError with the code ERROR_CODE.NOT_FOUND if the user is not found.
 */
export async function getUserById(userId) {
  const user = await usersService.getById(userId);

  if (user) {
    return user;
  }

  throw new CustomError(`User ${userId} not found.`, ERROR_CODE.NOT_FOUND);
}

/**
 * Updates the last connection timestamp for a user.
 *
 * @param {string} userId - The ID of the user.
 * @returns {Promise<any>} - A promise that resolves to the result of the update operation.
 * @throws {Error} - If an error occurs during the update operation.
 */
export async function updateLastConnection(userId) {
  try {
    const result = await usersService.updateOne(userId, {
      last_connection: new Date(),
    });

    return result;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Uploads a document for a user.
 *
 * @param {string} userId - The ID of the user.
 * @param {object} newDocument - The new document to be uploaded.
 * @returns {Promise<object>} - The updated user object with the uploaded document.
 */
export async function uploadDocument(userId, newDocument) {
  const user = await usersService.getById(userId);

  const result = await usersService.updateOne(userId, {
    documents: user.documents
      ? [...user.documents, newDocument]
      : [newDocument],
  });

  return result;
}
