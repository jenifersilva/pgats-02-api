// Injeta o usuário autenticado no contexto do ApolloServer
const { getUserFromToken } = require('./auth');

module.exports = ({ req }) => {
  const token = req.headers.authorization || '';
  const user = getUserFromToken(token);
  return { user };
};
