import express from 'express';
import { wallet, transactions, addTransaction } from '../data/data.js';

const router = express.Router();

// GET /api/wallet
router.get('/wallet', (req, res) => {
  res.json(wallet);
});

// POST /api/wallet/deposit
router.post('/wallet/deposit', (req, res) => {
  const { amount, description } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than 0' });
  }
  
  wallet.balance += amount;
  const desc = description || `Deposit of PKR ${amount}`;
  addTransaction('credit', amount, desc);
  res.json({ balance: wallet.balance, message: 'Deposit successful' });
});

// POST /api/wallet/withdraw
router.post('/wallet/withdraw', (req, res) => {
  const { amount, description } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than 0' });
  }
  
  if (amount > wallet.balance) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }
  
  wallet.balance -= amount;
  const desc = description || `Withdrawal of PKR ${amount}`;
  addTransaction('debit', amount, desc);
  res.json({ balance: wallet.balance, message: 'Withdrawal successful' });
});

// GET /api/transactions
router.get('/transactions', (req, res) => {
  let filtered = [...transactions];
  const { type } = req.query;
  
  if (type === 'credit') {
    filtered = filtered.filter(t => t.type === 'credit');
  } else if (type === 'debit') {
    filtered = filtered.filter(t => t.type === 'debit');
  }
  
  res.json(filtered);
});

export default router;