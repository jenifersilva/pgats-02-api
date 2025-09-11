// Bibliotecas
const request = require("supertest"); // Para fazer requisições HTTP assíncronas
const { expect } = require("chai"); // Para fazer asserções com base nas respostas das requisições

// Teste batendo no server
describe("Transfer - REST via HTTP", () => {
  const restUrl = "http://localhost:3000";

  describe("POST /transfer", () => {
    // Estrutura do mocha para organizar os testes em grupos (describe) e casos de teste individuais (it)

    beforeEach(async () => {
      // Autentica e obtém o token JWT antes dos testes
      const respostaLogin = await request(restUrl)
        .post("/users/login")
        .send({ username: "jenifer", password: "senha123" });

      token = respostaLogin.body.token;
    });

    it("Quando informo remetente ou destinatário inexistentes recebo status code 400", async () => {
      const resposta = await request(restUrl) // Quero utilizar o supertest para fazer requisições diretamente à minha API (server)
        .post("/transfer") // Faz uma requisição POST informando os dados necessários para uma transferência
        .set("Authorization", `Bearer ${token}`)
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

    it("Quando informo valor maior que o saldo, não deve permitir transferência sem saldo disponível", async () => {
      const resposta = await request(restUrl)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send({ from: "jenifer", to: "tiago", amount: 1001 });

      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.have.property(
        "error",
        "Saldo insuficiente para realizar a transferência"
      );
    });

    it("Quando faço uma transferência sem token de autenticação recebo status code 401", async () => {
      const resposta = await request(restUrl)
        .post("/transfer")
        .send({ from: "jenifer", to: "tiago", amount: 10 });

      expect(resposta.status).to.equal(401);
      expect(resposta.body).to.have.property("error", "Token não fornecido");
    });

    it("Quando informo valores válidos recebo status code 201", async () => {
      const resposta = await request(restUrl)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send({
          from: "jenifer",
          to: "tiago",
          amount: 10,
        });

      expect(resposta.status).to.equal(201);
    });
  });
});
