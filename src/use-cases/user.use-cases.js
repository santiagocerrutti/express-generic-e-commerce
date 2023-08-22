import dayjs from "dayjs";
import { logger } from "../config/logger.js";
import { newPasswordHtmlTemplate } from "../mail/email-templates.js";
import { sendEmail } from "../mail/mail-service.js";
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
import { ROLES } from "../middlewares/auth/isAuthorized.js";

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

export async function getUserByEmail(email) {
  const foundUser = await usersService.getOneByFilter({ email });

  return foundUser;
}

export async function findUserById(userId) {
  const foundUser = await usersService.getById(userId);

  return foundUser;
}

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
        ERROR_CODE.BUSSINES_LOGIC_ERROR
      );
    }

    throw new CustomError(
      `Current reset password token expired.`,
      ERROR_CODE.BUSSINES_LOGIC_ERROR
    );
  }

  throw new CustomError(`Token ${tokenId} not found.`, ERROR_CODE.NOT_FOUND);
}

export async function sendResetPasswordEmail(emailAddress) {
  const user = await getUserByEmail(emailAddress);

  if (user) {
    try {
      const recoveryToken = await passwordRecoveryTokenService.addOne({
        user: user._id,
        issued_at: dayjs(),
        expired_at: dayjs().add(1, "hour"),
      });

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
    ERROR_CODE.BUSSINES_LOGIC_ERROR
  );
}

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

export async function getUserById(userId) {
  const user = await usersService.getById(userId);

  if (user) {
    return user;
  }

  throw new CustomError(`User ${userId} not found.`, ERROR_CODE.NOT_FOUND);
}

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

export async function uploadDocument(userId, newDocument) {
  const user = await usersService.getById(userId);

  const result = await usersService.updateOne(userId, {
    documents: user.documents
      ? [...user.documents, newDocument]
      : [newDocument],
  });

  return result;
}
