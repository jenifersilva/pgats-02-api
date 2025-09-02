// Bibliotecas
const request = require("supertest"); // Para fazer requisições HTTP assíncronas
const { expect } = require("chai"); // Para fazer asserções com base nas respostas das requisições

// Teste batendo no server
describe("Transfer", () => {
  describe("POST /transfer", () => {
    // Estrutura do mocha para organizar os testes em grupos (describe) e casos de teste individuais (it)
    it("Quando informo remetente ou destinatário inexistentes recebo status code 400", async () => {
      const resposta = await request('http://localhost:3000') // Quero utilizar o supertest para fazer requisições diretamente à minha API (server)
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
});