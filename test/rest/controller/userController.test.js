const request = require("supertest");
const sinon = require("sinon");
const { expect } = require("chai");
const app = require("../../../app.js");
const userService = require("../../../service/userService.js");

describe("User Controller", () => {
  describe("POST /users/register", () => {
    it("Deve retornar erro quando o usuário já existir", async () => {
      const resposta = await request(app)
        .post("/users/register")
        .send({
          username: "jenifer",
          password: "senha123",
          favorecidos: ["tiago"],
        });
      expect(resposta.status).to.equal(400);
    });

    it("Deve criar usuário com sucesso", async () => {
      const resposta = await request(app)
        .post("/users/register")
        .send({
          username: `user${Math.random()}`,
          password: "password",
          favorecidos: "favorecido",
        });
      expect(resposta.status).to.equal(201);
    });
  });

  describe("POST /users/login", () => {
    it("Deve retornar erro quando as credenciais forem inválidas", async () => {
      const resposta = await request(app)
        .post("/users/login")
        .send({
          username: "user",
          password: `password${Math.random()}`,
        });
      expect(resposta.status).to.equal(401);
    });
  });
});

describe("User Controller com service mocked", () => {
  describe("POST /users/register", () => {
    it("Deve retornar erro quando o usuário já existir", async () => {
      const userServiceMock = sinon.stub(userService, "registerUser");
      userServiceMock.throws(new Error("Usuário já existe"));

      const resposta = await request(app)
        .post("/users/register")
        .send({
          username: "string",
          password: "string",
          favorecidos: ["string"],
        });
      expect(resposta.status).to.equal(400);
    });

    it("Deve criar usuário com sucesso", async () => {
      const userServiceMock = sinon.stub(userService, "registerUser");
      userServiceMock.returns({
        username: "user0.1692920450522315",
        password: "password",
        favorecidos: "favorecido",
      });

      const resposta = await request(app)
        .post("/users/register")
        .send({
          username: `user${Math.random()}`,
          password: "password",
          favorecidos: "favorecido",
        });
      expect(resposta.status).to.equal(201);
    });
  });

  describe("POST /users/login", () => {
    it("Deve retornar erro quando as credenciais forem inválidas", async () => {
      const userServiceMock = sinon.stub(userService, "authenticateUser");
      userServiceMock.throws(new Error("Credenciais inválidas"));

      const resposta = await request(app).post("/users/login").send({
        username: "string",
        password: "string",
      });
      expect(resposta.status).to.equal(401);
    });
  });

  afterEach(() => {
    sinon.restore();
  });
});
