const express = require('express');
const router = express.Router();
const transferService = require('../service/transferService');

router.post('/transfer', (req, res) => {
  try {
    const transfer = transferService.createTransfer(req.body);
    res.status(201).json(transfer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/transfers', (req, res) => {
  res.json(transferService.getTransfers());
});

module.exports = router;
