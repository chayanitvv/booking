const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const createToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const ensureAuthIsConfigured = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
};

const publicUser = (user) => ({
  id: user._id,
  email: user.email,
  profile: user.profile,
  role: user.role,
  createdAt: user.createdAt,
});

const register = async (req, res, next) => {
  try {
    // Check configuration before saving so a misconfigured server never creates a partial account.
    ensureAuthIsConfigured();
    const { email, password, firstName, lastName, phone, passportNo } = req.body;

    if (!email || !password || !firstName || !lastName || !phone) {
      return res.status(400).json({ message: 'Email, password, first name, last name, and phone are required' });
    }

    const user = await User.create({
      email,
      password,
      profile: { firstName, lastName, phone, passportNo },
    });

    res.status(201).json({ token: createToken(user._id.toString()), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    ensureAuthIsConfigured();
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({ token: createToken(user._id.toString()), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res) => {
  res.json({ user: publicUser(req.user) });
};

module.exports = { register, login, me };
