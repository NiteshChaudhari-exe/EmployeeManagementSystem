import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const registerUser = async (email, password, firstName, lastName) => {
  // Check if user exists
  let user = await User.findOne({ email });
  if (user) {
    throw new Error('User already exists with that email');
  }

  // Create new user
  user = await User.create({
    email,
    password,
    firstName,
    lastName,
  });

  // Generate token
  const token = generateToken(user._id, user.role);

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };
};

export const loginUser = async (email, password) => {
  // Validate email & password
  if (!email || !password) {
    throw new Error('Please provide email and password');
  }

  // Check for user (include password in query)
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id, user.role);

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };
};
