const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

class AuthService {
  async register(userData) {
    const { firstName, lastName, email, password } = userData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash,
    });

    const token = generateToken(user._id);

    return {
      user,
      token,
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken(user._id);

    const userObject = user.toObject();

    delete userObject.passwordHash;

    return {
      user: userObject,
      token,
    };
  }
}

module.exports = new AuthService();
