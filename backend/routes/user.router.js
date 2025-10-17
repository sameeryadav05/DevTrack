const express = require('express')
const { login,signup,verifyEmail,resendVerificationCode,logout} = require('../controllers/AuthController.js')

const {getUserProfile,getAllUser,updateUserProfile,DeleteUserProfile} = require('../controllers/userController.js');
const { auth } = require('../middleware/auth.js');

const UserRouter = express.Router()

UserRouter.post('/signup',signup);
UserRouter.post('/resend-code',resendVerificationCode);
UserRouter.post('/verify-email',verifyEmail);
UserRouter.post('/login',login);
UserRouter.post('/logout',auth,logout);
UserRouter.get('/allUsers',getAllUser);
UserRouter.get('/UserProfile',auth,getUserProfile);
UserRouter.put('/updateProfile',updateUserProfile);
UserRouter.get('/deleteProfile',DeleteUserProfile);

module.exports = {UserRouter}