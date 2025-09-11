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

## Como executar a API REST

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor REST:
   ```bash
   npm start
   ```
3. Acesse a documentação Swagger em: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Como executar a API GraphQL

1. Instale as dependências:
   ```bash
   npm install apollo-server-express@^3.12.0 express@^4.18.2 graphql jsonwebtoken dotenv
   ```
2. Inicie o servidor GraphQL:
   ```bash
   npm run start-graphql
   ```
3. Acesse o playground GraphQL em: [http://localhost:4000/graphql](http://localhost:4000/graphql)

## Autenticação JWT

- O login (`POST /users/login`) retorna um token JWT.
- As rotas de transferência (`POST /transfer` e `GET /transfers`) exigem autenticação via Bearer Token (JWT).
- Para acessar essas rotas, inclua o header:
   ```
   Authorization: Bearer <seu_token_jwt>
   ```
- O Swagger está configurado para permitir o envio do token nas rotas protegidas.

- `POST /users/register`: Registra um novo usuário. Não permite usuários duplicados. O campo `favorecidos` é opcional e pode ser usado para definir usuários favoritos para transferências.
- `POST /users/login`: Realiza login. Usuário e senha obrigatórios. Retorna um token JWT.
- `GET /users`: Lista todos os usuários.
- `POST /transfer`: Realiza transferência. Requer autenticação JWT. Só permite valores acima de R$ 5.000,00 para favorecidos.
- `GET /transfers`: Lista todas as transferências. Requer autenticação JWT.


## Exemplos de Registro de Usuário

### Usuário simples
```json
{
   "username": "joao",
   "password": "senha123"
}
```

### Usuário com favorecidos
```json
{
   "username": "joao",
   "password": "senha123",
   "favorecidos": ["maria", "pedro"]
}
```

## Regras de Negócio

- Login exige usuário e senha.
- Não é possível registrar usuários duplicados.
- Transferências acima de R$ 5.000,00 só podem ser feitas para favorecidos.

## Testes

Para testar a API, recomenda-se o uso do [Supertest](https://github.com/visionmedia/supertest) junto com frameworks como Jest ou Mocha.


## Estrutura de Diretórios

- `controller/`: Routers Express para endpoints
- `service/`: Regras de negócio
- `model/`: Dados em memória
- `middleware/`: Middlewares (ex: autenticação JWT)
- `app.js`: Configuração da aplicação Express e uso dos routers
- `server.js`: Inicialização do servidor
- `swagger.json`: Documentação Swagger

---

API desenvolvida para fins de aprendizado e automação de testes.
