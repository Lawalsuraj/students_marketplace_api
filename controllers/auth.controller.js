import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import  User  from "../models/user.model.js";
import { generateAcessToken, generateRefreshToken } from '../utils/generateToken.js';
import { setCokies } from '../utils/setCookies.js';
import AppError from '../utils/AppError.js';
import { sendOTP, verifyOTP } from '../utils/otp.js';
import logger from '../config/logger.js'
import uploadToCloudinary from '../utils/uploadToCloudinary.js';


export const register = async (req,res)=>{

    const {fullName, email, password} =req.body;

    let imageUrl;
    if(req.file) imageUrl = await uploadToCloudinary(req.file.buffer,'student-marketplace/profiles'); 
    
    const salt = await bcrypt.genSalt(10);
    
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = await User.create({fullName, email,password:hashedPassword, profilePicture:imageUrl});

    logger.info(`New user registered: ${newUser.email}`);


    const accesstoken = await generateAcessToken(newUser);
    const refreshToken = await generateRefreshToken(newUser)
    
    setCokies(res,accesstoken,refreshToken)
    
    return res.status(201).json({
        success:true,
        message:'user created!',
        user:newUser 
    });
    
    await sendOTP(email, 'email-verification');


}
export const login = async(req,res)=>{

    const {email, password} =req.body;


    const foundUser = await User.findOne({email}).select('+password');
    
    if(!foundUser) throw new AppError('user not found', 404); 
    
    const match = await bcrypt.compare(password, foundUser.password);

    if(!match) throw new AppError('invalid password', 401);

    if (!foundUser.isVerified) {
    await sendOTP(email, 'email-verification');
    throw new AppError('Email not verified. OTP sent to your email.', 401);
  }

    const accesstoken = await generateAcessToken(foundUser);
    const refreshToken = await generateRefreshToken(foundUser)
    
    setCokies(res,accesstoken,refreshToken);

      logger.info(`user logged in: ${foundUser.email}`);
    
    return res.status(200).json({
        success:true,
        message:'loggedin successfully!',
        user:foundUser 
    });


}



export const getMe = async (req,res)=>{
    res.status(200).json({
        success:true,
        data:req.user
    })
}


export const forgotPassword = async (req, res) => {
  
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new AppError('No account with this email', 404);

  await sendOTP(email, 'password-reset');

  res.status(200).json({
    success: true,
    message: 'OTP sent to your email',
  });
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const isValid = await verifyOTP(email, otp, 'password-reset');
  if (!isValid) throw new AppError('Invalid or expired OTP', 400);

  const user = await User.findOne({email}).select('+password')

    const hashedPassword = await bcrypt.hash(user.password,10)

  user.password = hashedPassword;
  await user.save(); 

  res.status(200).json({
    success: true,
    message: 'Password reset successfully',
  });
};

export const refreshAccessToken = async(req, res)=>{
    
    const refreshToken =req.cookies.RefreshToken;
    if(!refreshToken) throw new AppError('invalid refresh tooken', 403);

    const decoded = await jwt.verify(refreshToken, process.env.token_secret);
    
    const user = await User.findById(decoded.id);
    if(!user) throw new AppError('no user associated with this token', 404);

    const newAccessToken = generateAcessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    
    setCokies(res, newAccessToken, newRefreshToken);
    
    res.status(200).json("access token generated")
}



export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  const isValid = await verifyOTP(email, otp, 'email-verification');
  if (!isValid) throw new AppError('Invalid or expired OTP', 400);

  await User.findOneAndUpdate({ email }, { isVerified: true });

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
  });
};


export const resendOTP = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new AppError('No account with this email', 404);

  if (user.isVerified) {
    throw new AppError('Email already verified', 400);
  }

  await sendOTP(email, 'email-verification');

  res.status(200).json({
    success: true,
    message: 'OTP sent successfully',
  });
};

 export const logout = async(req, res)=>{
 
     res.clearCookie('AccessToken');
     res.clearCookie('RefreshToken');
 
     res.status(200).json({
         success:true,
         message:"logged out successfully"
     });
 }