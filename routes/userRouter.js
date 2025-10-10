import express from 'express';
import {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
  getOneUser,
  uploadProfileImage
} from '../controllers/userController.js';

import { protect } from '../controllers/authController.js';

const router = express.Router();



router.route('/')
  .post(createUser)
  .get(getAllUsers)


router.route('/profile-image')
  .post(protect, uploadProfileImage)

router.route('/:id')
  .get(getOneUser)
  .delete(deleteUser)
  .patch(updateUser)



export const userRouter = router;