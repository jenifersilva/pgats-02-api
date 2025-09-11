// Implementação das resolvers usando os Services existentes
const userService = require('../service/userService');
const transferService = require('../service/transferService');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secret';

const resolvers = {
  Query: {
    users: async () => userService.getAllUsers(),
    transfers: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return transferService.getAllTransfers();
    },
  },
  Mutation: {
    registerUser: async (_, { username, password, favorecidos }) => {
      return userService.registerUser({ username, password, favorecidos });
    },
    loginUser: async (_, { username, password }) => {
      let user;
      try {
        user = userService.authenticateUser(username, password);
      } catch (err) {
        throw new Error('Credenciais inválidas');
      }
      const token = jwt.sign({ username: user.username }, SECRET, { expiresIn: '1h' });
      return { token, user };
    },
    createTransfer: async (_, { from, to, amount }, { user }) => {
      if (!user) throw new Error('Token não fornecido');
      return transferService.createTransfer({ from, to, amount });
    },
  },
};

module.exports = resolvers;
