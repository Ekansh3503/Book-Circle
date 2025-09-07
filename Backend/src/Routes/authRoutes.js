
import express from 'express'
import authController from '../controller/authController.js'
const router = express.Router()

router.post('/add-user', authController.AddUser);
router.post('/login',authController.login);
router.post('/mfa', authController.mfa);
router.post('/forgot-password', authController.forgotPassword);
router.post('/set-password', authController.setPassword);
router.post('/reset-password', authController.resetPassword);

export default router