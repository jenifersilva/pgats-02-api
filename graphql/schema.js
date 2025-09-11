// Definição dos Types, Queries e Mutations
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    username: String!
    favorecidos: [String]
  }

  type Transfer {
    from: String!
    to: String!
    amount: Float!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User]
    transfers: [Transfer]
  }

  type Mutation {
    registerUser(username: String!, password: String!, favorecidos: [String]): User
    loginUser(username: String!, password: String!): AuthPayload
    createTransfer(from: String!, to: String!, amount: Float!): Transfer
  }
`;

module.exports = typeDefs;
