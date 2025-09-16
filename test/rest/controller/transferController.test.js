const request = require("supertest"); // Para fazer requisições HTTP assíncronas
const sinon = require("sinon"); // Para criar mocks dos services
const { expect, use } = require("chai"); // Para fazer asserções com base nas respostas das requisições
const chaiExclude = require("chai-exclude");
use(chaiExclude);

// Aplicação
const app = require("../../../app.js");

// Service a ser mockado
const transferService = require("../../../service/transferService.js");

// Teste batendo no APP
describe("Transfer Controller", () => {
  beforeEach(async () => {
    // Autentica e obtém o token JWT antes dos testes
    const respostaLogin = await request(app)
      .post("/users/login")
      .send({ username: "tiago", password: "senha123" });
    token = respostaLogin.body.token;
  });

  describe("POST /transfer", () => {
    it("Deve retornar erro quando remetente ou destinatário não existirem", async () => {
      const resposta = await request(app)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send({
          from: "jenifer",
          to: "teste",
          amount: 10,
        });
      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.have.property(
        "error",
        "Usuário remetente ou destinatário não encontrado"
      );
    });
  });

  describe("GET /transfers", () => {
    it("Deve retornar todas as transferências com sucesso", async () => {
      const resposta = await request(app)
        .get("/transfers")
        .set("Authorization", `Bearer ${token}`);
      expect(resposta.status).to.equal(200);
    });
  });
});

// Testes com mock
describe("Transfer Controller com service mocked", () => {
  beforeEach(() => {
    // Mocka o middleware de autenticação para sempre permitir acesso
    const authenticateToken = require("../../../middleware/authenticateToken.js");
    authenticateTokenMock = sinon
      .stub(authenticateToken, "call")
      .callsFake((req, res, next) => next());
  });

  afterEach(() => {
    // Reseta os mocks, sem esse reset o sinon vai persistir o mock para outros testes
    sinon.restore();
  });

  describe("POST /transfer", () => {
    it("Deve retornar erro quando remetente ou destinatário não existirem", async () => {
      // Mockar apenas a função transfer do Service
      const transferServiceMock = sinon.stub(transferService, "createTransfer");
      // Simula a resposta de erro do createTransfer do Service
      transferServiceMock.throws(
        new Error("Usuário remetente ou destinatário não encontrado")
      );

      const resposta = await request(app)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send({
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

    it("Deve realizar transferência com sucesso", async () => {
      const transferServiceMock = sinon.stub(transferService, "createTransfer");
      transferServiceMock.returns({
        from: "tiago",
        to: "jenifer",
        amount: 10,
        date: new Date().toISOString(),
      });

      const resposta = await request(app)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send({
          from: "tiago",
          to: "jenifer",
          amount: 10,
        });

      expect(resposta.status).to.equal(201);
      expect(resposta.body).to.have.property("from", "tiago");
      expect(resposta.body).to.have.property("to", "jenifer");
      expect(resposta.body).to.have.property("amount", 10);
    });

    it("Deve realizar transferência com sucesso - Utilização de fixture", async () => {
      const transferServiceMock = sinon.stub(transferService, "createTransfer");
      transferServiceMock.returns({
        from: "jenifer",
        to: "tiago",
        amount: 10,
        date: new Date().toISOString(),
      });

      const resposta = await request(app)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send({
          from: "jenifer",
          to: "tiago",
          amount: 10,
        });

      expect(resposta.status).to.equal(201);
      expect(resposta.body.date).to.be.not.null;

      const respostaEsperada = require("../fixture/responses/transferSuccessfullyCreated.json");

      expect(resposta.body).excluding("date").to.deep.equal(respostaEsperada); // to.deep.equal ou to.eql = compara os campos de maneira recursiva sem se importar com a ordem dos campos
    });
  });
});
