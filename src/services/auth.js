import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendEmail.js';
import SessionCollection from '../db/models/Session.js';
import UserCollection from '../db/models/User.js';
// import path from 'path';
// import fs from 'fs/promises';
// import Handlebars from 'handlebars';
// import { TEMPLATES_DIR } from '../constants/index.js';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/auth.js';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = Date.now() + accessTokenLifeTime;
  const refreshTokenValidUnitl = Date.now() + refreshTokenLifeTime;

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUnitl,
  };
};

export const findSession = (query) => SessionCollection.findOne(query);

export const findUser = (query) => UserCollection.findOne(query);

// const jwtSecret = getEnvVar('JWT_SECRET');
const appDomain = getEnvVar('APP_DOMAIN');
// const verifyEmailPath = path.join(TEMPLATES_DIR, 'verify-email.html');

export const registerUser = async (payload) => {
  const { email, password } = payload;
  const user = await findUser({ email });
  if (user) {
    throw createHttpError(409, 'Email already in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await UserCollection.create({
    ...payload,
    password: hashPassword,
  });

  // const token = jwt.sign({ email }, jwtSecret, { expiresIn: '24h' });

  // const templateSource = await fs.readFile(verifyEmailPath, 'utf-8');
  // const template = Handlebars.compile(templateSource);
  // const html = template({
  //   verifyLink: `${appDomain}/auth/verify?token=${token}`,
  // });

  // await sendEmail({
  //   from: getEnvVar('SMTP_FROM'),
  //   to: email,
  //   subject: 'Verify email',
  //   html,
  // });

  return newUser;
};

// export const verifyUser = async (token) => {
//   try {
//     const { email } = jwt.verify(token, jwtSecret);
//     return await UserCollection.findOneAndUpdate(
//       { email },
//       { verify: true },
//       { new: true },
//     );
//   } catch (error) {
//     throw createHttpError(401, error.message);
//   }
// };

//
export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  try {
    await sendEmail({
      from: getEnvVar('SMTP_FROM'),
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${appDomain}/auth/reset-password?token=${resetToken}">here</a> to reset your password!</p>`,
    });
  } catch (error) {
    console.log(error.message);

    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError(401, 'Token is expired or invalid.');
    throw err;
  }

  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UserCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );

  await SessionCollection.findOneAndDelete({ userId: user._id });
};

export const loginUser = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });
  if (!user) throw createHttpError(401, 'Email or password invalid');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createHttpError(401, 'Email or password invalid');

  await SessionCollection.findOneAndDelete({ userId: user._id });

  const session = createSession();

  return await SessionCollection.create({ userId: user._id, ...session });
};

export const refreshUser = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) throw createHttpError(401, 'Session not found');

  if (session.refreshTokenValidUntil < Date.now()) {
    await SessionCollection.findOneAndDelete({ _id: session._id });
    throw createHttpError(401, 'Session token expired');
  }

  await SessionCollection.findOneAndDelete({ _id: sessionId });

  const newSession = createSession();

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  return await SessionCollection.deleteOne({ _id: sessionId });
};
