// Bibliotecas
const request = require("supertest"); // Para fazer requisições HTTP assíncronas
const sinon = require("sinon"); // Para criar mocks dos services
const { expect } = require("chai"); // Para fazer asserções com base nas respostas das requisições

// Aplicação
const app = require("../../app.js");

// Teste batendo no service
describe("Transfer controller", () => {
  describe("POST /transfer", () => {
    // estrutura do mocha para organizar os testes em grupos (describe) e casos de teste individuais (it)
    it("Quando informo remetente ou destinatário inexistentes recebo status code 400", async () => {
      const resposta = await request(app) // quero utilizar o supertest para fazer requisições diretamente à minha API (app)
        .post("/transfer") // faz uma requisição POST informando os dados necessários para uma transferência
        .send({
          from: "tiago",
          to: "jenifer",
          amount: 10,
        });
      expect(resposta.status).to.equal(400); // verifica o status code da resposta
      expect(resposta.body).to.have.property(
        // verifica o body da resposta
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
