import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, isVerified: user.isVerified },
    process.env.JWT_SECRET || 'supersecret_aether_access_token_key_2026_xyz',
    { expiresIn: '15m' } // 15 minutes access token expiry
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || 'supersecret_aether_refresh_token_key_2026_abc',
    { expiresIn: '7d' } // 7 days refresh token expiry
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'supersecret_aether_access_token_key_2026_xyz');
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'supersecret_aether_refresh_token_key_2026_abc');
};
