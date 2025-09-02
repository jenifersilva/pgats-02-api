// Bibliotecas
const request = require("supertest"); // Para fazer requisições HTTP assíncronas
const sinon = require("sinon"); // Para criar mocks dos services
const { expect } = require("chai"); // Para fazer asserções com base nas respostas das requisições

// Aplicação
const app = require("../../app.js");

// Service a ser mockado
const transferService = require("../../service/transferService.js");

// Teste batendo no APP
describe("Transfer Controller", () => {
  describe("POST /transfer", () => {
    // Estrutura do mocha para organizar os testes em grupos (describe) e casos de teste individuais (it)
    it("Quando informo remetente ou destinatário inexistentes recebo status code 400", async () => {
      const resposta = await request(app) // Quero utilizar o supertest para fazer requisições diretamente à minha API (app)
        .post("/transfer") // Faz uma requisição POST informando os dados necessários para uma transferência
        .send({
          from: "tiago",
          to: "jenifer",
          amount: 10,
        });
      expect(resposta.status).to.equal(400); // Verifica o status code da resposta
      expect(resposta.body).to.have.property(
        // Verifica o body da resposta
        "error",
        "Usuário remetente ou destinatário não encontrado"
      );
    });
  });

  describe("GET /transfers", () => {
    it("Quando busco todas as transferências recebo status code 200", async () => {
      const resposta = await request(app).get("/transfers");
      expect(resposta.status).to.equal(200);
    });
  });
});

// Testes com mock
describe("Transfer Controller com service mocked", () => {
  describe("POST /transfer", () => {
    // Este teste valida somente o status code do transferController
    it("Quando informo remetente ou destinatário inexistentes recebo status code 400", async () => {
      // Mockar apenas a função transfer do Service
      const transferServiceMock = sinon.stub(transferService, "createTransfer");
      // Simula a resposta de erro do createTransfer do Service
      transferServiceMock.throws(
        new Error("Usuário remetente ou destinatário não encontrado")
      );

      const resposta = await request(app).post("/transfer").send({
        from: "tiago",
        to: "jenifer",
        amount: 10,
      });
      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.have.property(
        "error",
        "Usuário remetente ou destinatário não encontrado"
      );
    });

    afterEach(() => {
      // Reseta os mocks, sem esse reset o sinon vai persistir o mock para outros testes
      sinon.restore();
    });
  });
});
