// Testes automatizados para a Mutation de Transfers via GraphQL
const request = require("supertest");
const { expect } = require("chai");

describe("Transfer - GraphQL via HTTP", () => {
  const graphqlUrl = "http://localhost:4000/graphql";
  const transferMutation = require('../fixture/mutations/transferMutation')
  const loginRequest = require('../fixture/requests/loginRequest')

  beforeEach(async () => {
    const respostaLogin = await request(graphqlUrl)
      .post("")
      .send(loginRequest);
    token = respostaLogin.body.data.loginUser.token;
  })

  it("Deve realizar transferência com sucesso", async () => {
    const resposta = await request(graphqlUrl)
      .post("")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: transferMutation,
        variables: { from: "jenifer", to: "tiago", amount: 10 }
      });

    expect(resposta.status).to.equal(200);
    expect(resposta.body.data.createTransfer).to.include({ from: "jenifer", to: "tiago", amount: 10 });
  });

  it("Não deve permitir transferência sem saldo disponível", async () => {
    const resposta = await request(graphqlUrl)
      .post("")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: transferMutation,
        variables: { from: "jenifer", to: "tiago", amount: 1001 }
      });

    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.have.property("errors");
    expect(resposta.body.errors[0].message).to.include("Saldo insuficiente");
  });

  it("Não deve permitir transferência sem token de autenticação", async () => {
    const resposta = await request(graphqlUrl)
      .post("")
      .send({
        query: transferMutation,
        variables: { from: "jenifer", to: "tiago", amount: 10 }
      });

    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.have.property("errors");
    expect(resposta.body.errors[0].message).to.include("Token não fornecido");
  });
});
