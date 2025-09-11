const { transfers } = require('../model/transferModel');
const { findUserByUsername } = require('./userService');

function createTransfer({ from, to, amount }) {
  const sender = findUserByUsername(from);
  const recipient = findUserByUsername(to);
  if (!sender || !recipient) {
    throw new Error('Usuário remetente ou destinatário não encontrado');
  }
  if (sender.saldo < amount) {
    throw new Error('Saldo insuficiente para realizar a transferência');
  }
  const isFavorecido = sender.favorecidos && sender.favorecidos.includes(to);
  if (!isFavorecido && amount >= 5000) {
    throw new Error('Transferências acima de R$ 5.000,00 só podem ser feitas para favorecidos');
  }
  sender.saldo -= amount;
  recipient.saldo += amount;
  const transfer = { from, to, amount, date: new Date() };
  transfers.push(transfer);
  return transfer;
}

function getTransfers() {
  return transfers;
}

module.exports = {
  createTransfer,
  getTransfers,
};
