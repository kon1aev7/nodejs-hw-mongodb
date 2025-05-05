import createHttpError from 'http-errors';
import {
  registerUser,
  loginUser,
  refreshUser,
  logoutUser,
  // verifyUser,
} from '../services/auth.js';
import { requestResetToken } from '../services/auth.js';
import { resetPassword } from '../services/auth.js';

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUnitl,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUnitl,
  });
};
// const setupSession = (res, session) => {
//   const expiresAt = new Date(session.refreshTokenValidUnitl);

//   res.cookie('refreshToken', session.refreshToken, {
//     httpOnly: true,
//     expires: expiresAt,
//   });

//   res.cookie('sessionId', session._id.toString(), {
//     httpOnly: true,
//     expires: expiresAt,
//   });
// };

export const registerController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

// export const verifyController = async (req, res) => {
//   await verifyUser(req.query.token);

//   res.json({
//     message: 'Email verified!',
//   });
// };

export const requestResetEmailController = async (req, res) => {
  console.log('Request received:', req.body);

  try {
    await requestResetToken(req.body.email);
    console.log('Email reset token sent successfully');
    res.json({
      message: 'Reset password email has been successfully sent.',
      status: 200,
      data: {},
    });
  } catch (error) {
    console.error('Error sending reset email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password has been successfully reset.',
    status: 200,
    data: {},
  });
};

export const loginController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshController = async (req, res) => {
  const session = await refreshUser(req.cookies);

  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  } else {
    throw createHttpError(401, 'Session not found');
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};