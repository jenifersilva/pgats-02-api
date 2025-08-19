const request = require("supertest");
const sinon = require("sinon");
const { expect } = require("chai");
const app = require("../../app.js");
const userService = require("../../service/userService.js");

describe("User controller com service mocked", () => {
  describe("POST /register", () => {
    it("Quando informo usuário já existente recebo status code 400", async () => {
      const userServiceMock = sinon.stub(userService, "registerUser");
      userServiceMock.throws(new Error("Usuário já existe"));

      const resposta = await request(app)
        .post("/register")
        .send({
          username: "string",
          password: "string",
          favorecidos: ["string"],
        });
      expect(resposta.status).to.equal(400);
    });
  });

  describe("POST /login", () => {
    it("Quando informo credenciais inválidas recebo status code 401", async () => {
      const userServiceMock = sinon.stub(userService, "authenticateUser");
      userServiceMock.throws(new Error('Credenciais inválidas'));

      const resposta = await request(app)
        .post("/login")
        .send({
            username: "string",
            password: "string"
        });
      expect(resposta.status).to.equal(401);
    });
  });

  afterEach(() => {
    sinon.restore();
  });
});
