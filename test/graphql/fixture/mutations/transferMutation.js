module.exports = `mutation Transfer($from: String!, $to: String!, $amount: Float!) {
    createTransfer(from: $from, to: $to, amount: $amount) {
      from
      to
      amount
    }
  }`;
