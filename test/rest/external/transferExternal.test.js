// Bibliotecas
const request = require("supertest"); // Para fazer requisições HTTP assíncronas
const { expect } = require("chai"); // Para fazer asserções com base nas respostas das requisições

require("dotenv").config();

// Teste batendo no server
describe("Transfer - REST via HTTP", () => {
  // Estrutura do mocha para organizar os testes em grupos (describe) e casos de teste individuais (it)

  beforeEach(async () => {
    // Autentica e obtém o token JWT antes dos testes
    const respostaLogin = await request(process.env.BASE_URL_REST)
      .post("/users/login")
      .send({ username: "jenifer", password: "senha123" });

    token = respostaLogin.body.token;
  });

  it("Deve retornar erro quando remetente ou destinatário não existirem", async () => {
    const resposta = await request(process.env.BASE_URL_REST) // Quero utilizar o supertest para fazer requisições diretamente à minha API (server)
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

  it("Deve retornar erro quando saldo for insuficiente", async () => {
    const resposta = await request(process.env.BASE_URL_REST)
      .post("/transfer")
      .set("Authorization", `Bearer ${token}`)
      .send({ from: "jenifer", to: "tiago", amount: 1001 });

    expect(resposta.status).to.equal(400);
    expect(resposta.body).to.have.property(
      "error",
      "Saldo insuficiente para realizar a transferência"
    );
  });

  it("Deve retornar erro quando a transferência for feita sem token de autenticação", async () => {
    const resposta = await request(process.env.BASE_URL_REST)
      .post("/transfer")
      .send({ from: "jenifer", to: "tiago", amount: 10 });

    expect(resposta.status).to.equal(401);
    expect(resposta.body).to.have.property("error", "Token não fornecido");
  });

  it("Deve realizar transferência com sucesso", async () => {
    const resposta = await request(process.env.BASE_URL_REST)
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
