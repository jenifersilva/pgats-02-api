# API de Transferências

Esta API permite login, registro de usuários, consulta de usuários e transferência de valores entre usuários. O banco de dados é em memória, ideal para aprendizado de testes e automação de APIs.

## Instalação

1. Clone o repositório:
   ```bash
   git clone <url-do-repo>
   cd pgats-02-api
   ```
2. Instale as dependências:
   ```bash
   npm install express swagger-ui-express
   ```

## Executando a API

- Para iniciar o servidor:
  ```bash
  node server.js
  ```
- Acesse a documentação Swagger em: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Endpoints

- `POST /register`: Registra um novo usuário. Não permite usuários duplicados.
- `POST /login`: Realiza login. Usuário e senha obrigatórios.
- `GET /users`: Lista todos os usuários.
- `POST /transfer`: Realiza transferência. Só permite valores acima de R$ 5.000,00 para favorecidos.
- `GET /transfers`: Lista todas as transferências.

## Regras de Negócio

- Login exige usuário e senha.
- Não é possível registrar usuários duplicados.
- Transferências acima de R$ 5.000,00 só podem ser feitas para favorecidos.

## Testes

Para testar a API, recomenda-se o uso do [Supertest](https://github.com/visionmedia/supertest) junto com frameworks como Jest ou Mocha.

## Estrutura de Diretórios

- `controller/`: Lógica dos endpoints
- `service/`: Regras de negócio
- `model/`: Dados em memória
- `app.js`: Configuração da aplicação Express
- `server.js`: Inicialização do servidor
- `swagger.json`: Documentação Swagger

---

API desenvolvida para fins de aprendizado e automação de testes.
