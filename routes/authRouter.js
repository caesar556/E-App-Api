import express from 'express';
import {
  login,
  signUp,
  refresh,
  logout,
  authMe
} from '../controllers/authController.js';

const router = express.Router();


router.route('/login')
  .post(login)

router.route('/register')
  .post(signUp)

router.route('/refresh-token')
  .post(refresh)
  
router.route('/me')
  .get(authMe)

router.route('/logout')
  .post(logout)

export const authRouter = router;