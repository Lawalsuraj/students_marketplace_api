import express from "express";
import { forgotPassword, getMe, login, logout, refreshAccessToken, register, resendOTP, resetPassword, verifyEmail } from "../controllers/auth.controller.js";
import { verify } from "../middlewares/secure.js";
import validate from '../middlewares/validate.js'
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post('/register',upload.single('profilePicture') ,validate(registerSchema) ,register);
router.post('/login',validate(loginSchema) , login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOTP);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logout);

router.get('/me', verify,getMe);

export default router;