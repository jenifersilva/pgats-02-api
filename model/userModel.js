// In-memory user database
const users = [
  {
    username: "tiago",
    password: "senha123",
    favorecidos: ["jenifer"],
    saldo: 1000
  },
  {
    username: "jenifer",
    password: "senha123",
    favorecidos: ["tiago"],
    saldo: 1000
  }
];

module.exports = {
  users,
};
