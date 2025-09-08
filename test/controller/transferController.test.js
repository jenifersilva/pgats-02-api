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
  beforeEach(async () => {
    // Autentica e obtém o token JWT antes dos testes
    const respostaLogin = await request(app)
      .post("/users/login")
      .send({ username: "tiago", password: "senha123" });
    token = respostaLogin.body.token;
  });

  describe("POST /transfer", () => {
    it("Quando informo remetente ou destinatário inexistentes recebo status code 400", async () => {
      // Estrutura do mocha para organizar os testes em grupos (describe) e casos de teste individuais (it)
      it("Quando informo remetente ou destinatário inexistentes recebo status code 400", async () => {
        const resposta = await request(app) // Quero utilizar o supertest para fazer requisições diretamente à minha API (app)
          .post("/transfer") // Faz uma requisição POST informando os dados necessários para uma transferência
          .set("Authorization", `Bearer ${token}`)
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
  describe("GET /transfers", () => {
    it("Quando busco todas as transferências recebo status code 200", async () => {
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
    const authenticateToken = require("../../middleware/authenticateToken");
    authenticateTokenMock = sinon
      .stub(authenticateToken, "call")
      .callsFake((req, res, next) => next());
  });

  afterEach(() => {
    // Reseta os mocks, sem esse reset o sinon vai persistir o mock para outros testes
    sinon.restore();
  });

  describe("POST /transfer", () => {
    // Este teste valida somente o status code do transferController
    it("Quando informo remetente ou destinatário inexistentes recebo status code 400", async () => {
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

    it("Quando informo valores válidos recebo status code 201", async () => {
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

    it("Quando informo valores válidos recebo status code 201 com fixture", async () => {
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
      expect(resposta.body.date).to.be.not.null;

      // Comparar a resposta.body com o json do arquivo de fixture
      // Preparar Dados - Carregar o arquivo de fixture
      const respostaEsperada = require("../fixture/responses/transferSuccessfullyCreated.json");

      // Preparar a forma de ignorar campos dinâmicos
      delete respostaEsperada.date;
      delete resposta.body.date;
      expect(resposta.body).to.deep.equal(respostaEsperada); // to.deep.equal ou to.eql = compara os campos de maneira recursiva sem se importar com a ordem dos campos
    });
  });
});
