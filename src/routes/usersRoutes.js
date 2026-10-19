import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import {
  getUser,
  updateUserAvatar,
  updateUser,
} from '../controllers/usersController.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.get('/users/me', authenticate, getUser);
router.patch('/users/me/update', authenticate, updateUser);
router.patch(
  '/users/me/avatar',
  authenticate,
  upload.single('avatar'),
  updateUserAvatar,
);

export default router;
