// Bibliotecas
const request = require("supertest"); // Para fazer requisições HTTP assíncronas
const { expect } = require("chai"); // Para fazer asserções com base nas respostas das requisições

// Teste batendo no server
describe("Transfer", () => {
  describe("POST /transfer", () => {
    // Estrutura do mocha para organizar os testes em grupos (describe) e casos de teste individuais (it)
    it("Quando informo remetente ou destinatário inexistentes recebo status code 400", async () => {
      const respostaLogin = await request("http://localhost:3000")
        .post("/users/login")
        .send({
          username: "jenifer",
          password: "senha123"
        });

      const resposta = await request("http://localhost:3000") // Quero utilizar o supertest para fazer requisições diretamente à minha API (server)
        .post("/transfer") // Faz uma requisição POST informando os dados necessários para uma transferência
        .set("Authorization", `Bearer ${respostaLogin.body.token}`)
        .send({
          from: "jenifer",
          to: "teste",
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

  describe("POST /transfer", () => {
    it("Quando informo valores válidos recebo status code 201", async () => {
      const respostaLogin = await request("http://localhost:3000")
        .post("/users/login")
        .send({
          username: "jenifer",
          password: "senha123"
        });

      const resposta = await request("http://localhost:3000") // Quero utilizar o supertest para fazer requisições diretamente à minha API (server)
        .post("/transfer") // Faz uma requisição POST informando os dados necessários para uma transferência
        .set("Authorization", `Bearer ${respostaLogin.body.token}`)
        .send({
          from: "jenifer",
          to: "tiago",
          amount: 10,
        });

      expect(resposta.status).to.equal(201); // Verifica o status code da resposta
    });
  });
});
