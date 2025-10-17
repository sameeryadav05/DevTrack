const { ExpressError } = require('../utils/ExpressError.js');
const { WrapAsync } = require('../utils/WrapAsync.js');
const bcrypt = require('bcrypt');
const { User } = require('../models/user.model.js');
const { generateToken } = require('../utils/Token.js');
const { generateEmailTemplate } = require('../utils/generateEmailTemplate.js');
const { sendEmail } = require('../utils/sendEmail.js');

const sendVerificationCode = async (verificationCode, email) => {
  try {
    const message = generateEmailTemplate(verificationCode);
    await sendEmail({
      email,
      subject: "Your 5-digit verification code",
      message,
    });
  } catch (error) {
    throw new ExpressError(500, "Failed to send verification code!");
  }
};

const canSendNewCode = (user) => {
  if (!user.verificationCodeExpire) return true;
  const lastSent = user.verificationCodeExpire - 5 * 60 * 1000;
  const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
  return lastSent < twoMinutesAgo;
};

const signup = WrapAsync(async (req, res) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!req.body) {
    throw new ExpressError(400, "Incomplete credentials!");
  }
  const { username, password, email } = req.body;
  if (!username) {
    throw new ExpressError(400, "username is required");
  }
  if (!emailRegex.test(email)) {
    throw new ExpressError(400, "Enter a valid email Id");
  }
  const isUserExistWithUsername = await User.findOne({ username });
  const isUserExistWithEmail = await User.findOne({ email });
  if (isUserExistWithUsername) {
    throw new ExpressError(400, "Username taken,please try another username");
  }
  if (isUserExistWithEmail) {
    throw new ExpressError(400, "User already exist,please login to continue");
  }
  if (password.length < 6) {
    throw new ExpressError(400, "Password must be atleast 6 characters long");
  }
  const user = new User({ username, password, email });
  const VerificationCode = await user.generateVerificationCode();
  await user.save();
  await sendVerificationCode(VerificationCode, email);
  res.status(200).json({ message: "verification code is sent to your email", userId: user._id });
});

const resendVerificationCode = WrapAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ExpressError(404, "User not found");
  if (user.accountVerified) throw new ExpressError(400, "Already verified");
  if (!canSendNewCode(user)) {
    throw new ExpressError(429, "verification already sent !");
  }
  const newCode = await user.generateVerificationCode();
  await user.save();
  await sendVerificationCode(newCode, email);
  res.status(200).json({ message: "New verification code sent", userId: user._id });
});

const verifyEmail = WrapAsync(async (req, res) => {
  if (!req.body) {
    throw new ExpressError(400, "Email and verification code are required");
  }
  const { email, verificationCode } = req.body;
  if (!email || !verificationCode) {
    throw new ExpressError(400, "Email and verification code are required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ExpressError(404, "User not found");
  }
  if (
    user.verificationCode !== parseInt(verificationCode) ||
    user.verificationCodeExpire < Date.now()
  ) {
    throw new ExpressError(400, "Invalid or expired verification code");
  }
  user.accountVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpire = undefined;
  await user.save();
  const token = generateToken({ id: user._id });
  res.status(201).cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 * 7 }).json({ message: "logged in successfully !", token });
});

const login = WrapAsync(async (req, res) => {
  if (!req.body) {
    throw new ExpressError(400, "email and password is required !");
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ExpressError(401, "Invalid credentials");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ExpressError(401, "Invalid credentials");
  }
  if (!user.accountVerified) {
    if (!canSendNewCode(user)) {
      throw new ExpressError(429, "verification already sent !");
    }
    const VerificationCode = await user.generateVerificationCode();
    await user.save();
    await sendVerificationCode(VerificationCode, email);
    res.status(200).json({ message: "verification code is sent to your email", userId: user._id });
  } else {
    const token = generateToken({ id: user._id });
    res.status(202).cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 * 7 }).json({ message: "logged in successfully !", token });
  }
});

const logout = WrapAsync(async (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "strict" }).status(200).send("logged out successfully !");
});

module.exports = { signup, login, verifyEmail, resendVerificationCode, logout };
