import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token.js';

// Helper to generate 6-digit OTP code
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Username or email already exists' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    const user = await User.create({
      username,
      email,
      password,
      otpCode: otp,
      otpExpires,
      isVerified: false
    });

    // In a real application, we would email the OTP. We will log it in console here for previewing
    console.log(`\n==========================================`);
    console.log(`[EMAIL DISPATCH SIMULATOR]`);
    console.log(`To: ${email}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`Expires: 10 minutes`);
    console.log(`==========================================\n`);

    res.status(201).json({
      success: true,
      message: 'Registration successful! An OTP code has been dispatched to your email.',
      email: user.email
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP code
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide email and OTP code' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Account is already verified' });
    }

    if (user.otpCode !== otp || new Date() > user.otpExpires) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code' });
    }

    user.isVerified = true;
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email successfully verified! You can now log in.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get tokens
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Your account is blocked. Please contact admin.' });
    }

    if (!user.isVerified) {
      // Re-trigger OTP
      const otp = generateOTP();
      user.otpCode = otp;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      console.log(`\n==========================================`);
      console.log(`[EMAIL DISPATCH SIMULATOR - ACCOUNT NOT VERIFIED]`);
      console.log(`To: ${email}`);
      console.log(`New OTP Code: ${otp}`);
      console.log(`==========================================\n`);

      return res.status(403).json({
        success: false,
        message: 'Account not verified. A verification OTP code has been dispatched.',
        notVerified: true,
        email: user.email
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        settings: user.settings
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refresh = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Account blocked' });
    }

    const accessToken = generateAccessToken(user);
    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Refresh token expired' });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otp = generateOTP();
    user.otpCode = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    console.log(`\n==========================================`);
    console.log(`[EMAIL DISPATCH SIMULATOR - PASSWORD RESET]`);
    console.log(`To: ${email}`);
    console.log(`Reset OTP Code: ${otp}`);
    console.log(`==========================================\n`);

    res.status(200).json({
      success: true,
      message: 'Password reset OTP code has been dispatched to your email.',
      email: user.email
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide all details' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.otpCode !== otp || new Date() > user.otpExpires) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code' });
    }

    user.password = newPassword;
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password has been successfully updated! You can now log in.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user details
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        settings: user.settings,
        memory: user.memory
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login as guest user instantly
// @route   POST /api/auth/guest
// @access  Public
export const guestLogin = async (req, res, next) => {
  try {
    const email = 'guest@aethertalk.local';
    const username = 'AetherGuest';
    
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        username,
        email,
        password: 'AetherGuestPassword123!',
        isVerified: true
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        settings: user.settings
      }
    });
  } catch (error) {
    next(error);
  }
};

