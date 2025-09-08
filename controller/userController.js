const express = require('express');
const router = express.Router();
const userService = require('../service/userService');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'segredo_super_simples';

router.post('/register', (req, res) => {
  try {
    const user = userService.registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Informe usuário e senha' });
  }
  try {
    const user = userService.authenticateUser(username, password);
    const token = jwt.sign({ username: user.username }, SECRET, { expiresIn: '2h' });
    res.json({ message: 'Login realizado com sucesso', token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

router.get('/users', (req, res) => {
  res.json(userService.getAllUsers());
});

module.exports = router;
