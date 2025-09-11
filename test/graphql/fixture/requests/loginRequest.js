module.exports = {
  query: `mutation Login($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      token
      user { username }
    }
  }`,
  variables: { username: "jenifer", password: "senha123" }
};
