const request = require("supertest");
const { expect } = require("chai");

require("dotenv").config();

const transferRequest = require("../fixture/requests/transfer/transferRequest.json");

// Teste batendo no server

describe("Transfer - REST via HTTP", () => {
  before(async () => {
    const loginRequest = require("../fixture/requests/login/loginRequest.json");
    const respostaLogin = await request(process.env.BASE_URL_REST)
      .post("/users/login")
      .send(loginRequest);

    token = respostaLogin.body.token;
  });

  it("Deve realizar transferência com sucesso", async () => {
    const resposta = await request(process.env.BASE_URL_REST)
      .post("/transfer")
      .set("Authorization", `Bearer ${token}`)
      .send(transferRequest);

    expect(resposta.status).to.equal(201);
  });

  const testesDeErrosDeNegocio = require("../fixture/requests/transfer/transferRequestWithError.json");
  testesDeErrosDeNegocio.forEach((teste) => {
    it(`${teste.nomeDoTeste}`, async () => {
      const respostaTransferencia = await request(process.env.BASE_URL_REST)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send(teste.createTransfer);

      expect(respostaTransferencia.status).to.equal(400);
      expect(respostaTransferencia.body.error).to.equal(teste.mensagemEsperada);
    });
  });

  it("Deve retornar erro quando a transferência for feita sem token de autenticação", async () => {
    const resposta = await request(process.env.BASE_URL_REST)
      .post("/transfer")
      .send(transferRequest);

    expect(resposta.status).to.equal(401);
    expect(resposta.body).to.have.property("error", "Token não fornecido");
  });
});
