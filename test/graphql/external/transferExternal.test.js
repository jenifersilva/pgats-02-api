// Testes automatizados para a Mutation de Transfers via GraphQL
const request = require("supertest");
const { expect, use } = require("chai");
const chaiExclude = require("chai-exclude");
use(chaiExclude);

const graphqlUrl = "http://localhost:4000/graphql";
const transferRequest = require("../fixture/requests/transferRequest.json");

describe("Transfer - GraphQL via HTTP", () => {
  before(async () => {
    const loginRequest = require("../fixture/requests/loginRequest.json");
    const loginUser = await request(graphqlUrl).post("").send(loginRequest);
    token = loginUser.body.data.loginUser.token;
  });

  beforeEach(async () => {
    transferRequest.variables.amount = 10; //reset json amount
  });

  it("Deve realizar transferência com sucesso", async () => {
    const resposta = await request(graphqlUrl)
      .post("")
      .set("Authorization", `Bearer ${token}`)
      .send(transferRequest);

    const respostaEsperada = require("../fixture/responses/transferSuccessfullyCreated.json");
    expect(resposta.status).to.equal(200);
    expect(resposta.body.data.createTransfer)
      .excluding("date")
      .to.deep.equal(respostaEsperada);
  });

  it("Não deve permitir transferência sem saldo disponível", async () => {
    transferRequest.variables.amount = 1001;
    const resposta = await request(graphqlUrl)
      .post("")
      .set("Authorization", `Bearer ${token}`)
      .send(transferRequest);

    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.have.property("errors");
    expect(resposta.body.errors[0].message).to.include("Saldo insuficiente");
  });

  it("Não deve permitir transferência sem token de autenticação", async () => {
    const resposta = await request(graphqlUrl).post("").send(transferRequest);

    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.have.property("errors");
    expect(resposta.body.errors[0].message).to.include("Token não fornecido");
  });
});
