import express from 'express';
import {
  login,
  signUp,
  refresh,
  logout
} from '../controllers/authController.js';

const router = express.Router();


router.route('/login')
  .post(login)

router.route('/sign-up')
  .post(signUp)

router.route('/refresh-token')
  .post(refresh)

router.route('/logout')
  .post(logout)

export const authRouter = router;