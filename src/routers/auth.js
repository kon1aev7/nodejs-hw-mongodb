import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import {
  authRegisterSchema,
  authLoginSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validations/auth.js';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  // verifyController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';

const authRouter = Router();

// signup
authRouter.post(
  '/register',
  validateBody(authRegisterSchema),
  ctrlWrapper(registerController),
);

// authRouter.get('/verify', ctrlWrapper(verifyController));

authRouter.post(
  '/login',
  validateBody(authLoginSchema),
  ctrlWrapper(loginController),
);

authRouter.post('/refresh', ctrlWrapper(refreshController));

authRouter.post('/logout', ctrlWrapper(logoutController));

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default authRouter;
