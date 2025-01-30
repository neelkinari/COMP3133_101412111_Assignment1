const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const userResolvers = {
  Mutation: {
    signup: async (_, { username, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
      return newUser;
    }
  },
  Query: {
    login: async (_, { username, email, password }) => {
      const user = await User.findOne({ $or: [{ username }, { email }] });
      if (!user) throw new Error("User not found");
      
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error("Invalid password");
      
      return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    }
  }
};

module.exports = userResolvers;