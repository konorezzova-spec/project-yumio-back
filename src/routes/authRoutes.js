// src/routes/authRoutes.js

import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
} from '../controllers/authController.js';
import {
  loginUserSchema,
  registerUserSchema,
} from '../validations/authValidation.js';

const router = Router();

router.post('/auth/register', celebrate(registerUserSchema), registerUser);
router.post('/auth/login', celebrate(loginUserSchema), loginUser);
router.post('/auth/logout', logoutUser);
router.post('/auth/refresh', refreshUserSession);

// router.post(
//   '/auth/request-reset-email',
//   celebrate(requestResetEmailSchema),
//   requestResetEmail,
// );
// router.post(
//   '/auth/reset-password',
//   celebrate(resetPasswordSchema),
//   resetPassword,
// );

export default router;
