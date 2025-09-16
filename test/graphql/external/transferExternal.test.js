const request = require("supertest");
const { expect, use } = require("chai");
const chaiExclude = require("chai-exclude");
use(chaiExclude);

require("dotenv").config();

const transferRequest = require("../fixture/requests/transfer/transferRequest.json");

describe("Transfer - GraphQL via HTTP", () => {
  before(async () => {
    const loginRequest = require("../fixture/requests/login/loginRequest.json");
    const loginUser = await request(process.env.BASE_URL_GRAPHQL)
      .post("")
      .send(loginRequest);
    token = loginUser.body.data.loginUser.token;
  });

  it("Deve realizar transferência com sucesso", async () => {
    const resposta = await request(process.env.BASE_URL_GRAPHQL)
      .post("")
      .set("Authorization", `Bearer ${token}`)
      .send(transferRequest);

    const respostaEsperada = require("../fixture/responses/transferSuccessfullyCreated.json");
    expect(resposta.status).to.equal(200);
    expect(resposta.body.data.createTransfer)
      .excluding("date")
      .to.deep.equal(respostaEsperada);
  });

  const testesDeErrosDeNegocio = require("../fixture/requests/transfer/transferRequestWithError.json");
  testesDeErrosDeNegocio.forEach((teste) => {
    it(`${teste.nomeDoTeste}`, async () => {
      const respostaTransferencia = await request(process.env.BASE_URL_GRAPHQL)
        .post("")
        .set("Authorization", `Bearer ${token}`)
        .send(teste.createTransfer);

      expect(respostaTransferencia.status).to.equal(teste.statusCode);
      expect(respostaTransferencia.body.errors[0].message).to.equal(
        teste.mensagemEsperada
      );
    });
  });

  it("Deve retornar erro quando a transferência for feita sem token de autenticação", async () => {
    const resposta = await request(process.env.BASE_URL_GRAPHQL)
      .post("")
      .send(transferRequest);

    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.have.property("errors");
    expect(resposta.body.errors[0].message).to.include("Token não fornecido");
  });
});
