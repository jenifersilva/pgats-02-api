// Testes automatizados para a Mutation de Transfers via GraphQL
const request = require("supertest");
const { expect } = require("chai");

describe("Transfer - GraphQL via HTTP", () => {
  const graphqlUrl = "http://localhost:4000/graphql";

  const loginMutation = `mutation Login($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      token
      user { username }
    }
  }`;

  const transferMutation = `mutation Transfer($from: String!, $to: String!, $amount: Float!) {
    createTransfer(from: $from, to: $to, amount: $amount) {
      from
      to
      amount
    }
  }`;

  it("Deve realizar transferência com sucesso", async () => {
    const loginRes = await request(graphqlUrl)
      .post("")
      .send({
        query: loginMutation,
        variables: { username: "jenifer", password: "senha123" }
      });
    const token = loginRes.body.data.loginUser.token;

    const res = await request(graphqlUrl)
      .post("")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: transferMutation,
        variables: { from: "jenifer", to: "tiago", amount: 10 }
      });

    expect(res.status).to.equal(200);
    expect(res.body.data.createTransfer).to.include({ from: "jenifer", to: "tiago", amount: 10 });
  });

  it("Não deve permitir transferência sem saldo disponível", async () => {
    const loginRes = await request(graphqlUrl)
      .post("")
      .send({
        query: loginMutation,
        variables: { username: "jenifer", password: "senha123" }
      });
    const token = loginRes.body.data.loginUser.token;

    const res = await request(graphqlUrl)
      .post("")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: transferMutation,
        variables: { from: "jenifer", to: "tiago", amount: 1001 }
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("errors");
    expect(res.body.errors[0].message).to.include("Saldo insuficiente");
  });

  it("Não deve permitir transferência sem token de autenticação", async () => {
    const res = await request(graphqlUrl)
      .post("")
      .send({
        query: transferMutation,
        variables: { from: "jenifer", to: "tiago", amount: 10 }
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("errors");
    expect(res.body.errors[0].message).to.include("Token não fornecido");
  });
});
