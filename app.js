const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const userRouter = require('./controller/userController');
const transferRouter = require('./controller/transferController');

const authenticateToken = require('./middleware/authenticateToken');

const app = express();
app.use(express.json());

// Swagger endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// User routes
app.use(userRouter);

// Transfer routes protegidas por JWT
app.use(authenticateToken, transferRouter);

module.exports = app;
