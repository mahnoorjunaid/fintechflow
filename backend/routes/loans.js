import express from 'express';
import { loanApplications, addLoan, updateLoanStatus } from '../data/data.js';

const router = express.Router();

// POST /api/loans/apply
router.post('/loans/apply', (req, res) => {
  const { applicant, cnic, contact, amount, purpose, tenure } = req.body;
  
  // Validation
  if (!applicant || !cnic || !contact || !amount || !purpose || !tenure) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (amount < 5000 || amount > 5000000) {
    return res.status(400).json({ error: 'Amount must be between PKR 5,000 and PKR 5,000,000' });
  }
  
  if (tenure < 3 || tenure > 60) {
    return res.status(400).json({ error: 'Tenure must be between 3 and 60 months' });
  }
  
  const cnicRegex = /^\d{5}-\d{7}-\d$/;
  if (!cnicRegex.test(cnic)) {
    return res.status(400).json({ error: 'CNIC must be in format XXXXX-XXXXXXX-X' });
  }
  
  const loan = addLoan({ applicant, cnic, contact, amount, purpose, tenure });
  res.status(201).json({ message: 'Loan application submitted', loanId: loan.id });
});

// GET /api/loans
router.get('/loans', (req, res) => {
  res.json(loanApplications);
});

// PATCH /api/loans/:id/status
router.patch('/loans/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status must be approved or rejected' });
  }
  
  const loan = updateLoanStatus(parseInt(id), status);
  if (!loan) {
    return res.status(404).json({ error: 'Loan not found' });
  }
  
  res.json({ message: `Loan ${status}`, loan });
});

// GET /api/emi-calculator
router.get('/emi-calculator', (req, res) => {
  const { principal, annualRate, months } = req.query;
  
  const P = parseFloat(principal);
  const annual = parseFloat(annualRate);
  const n = parseFloat(months);
  
  if (isNaN(P) || isNaN(annual) || isNaN(n) || P <= 0 || annual < 0 || n <= 0) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }
  
  const r = annual / 100 / 12;
  let emi;
  
  if (r === 0) {
    emi = P / n;
  } else {
    emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }
  
  const totalPayable = emi * n;
  const totalInterest = totalPayable - P;
  
  res.json({
    emi: parseFloat(emi.toFixed(2)),
    totalPayable: parseFloat(totalPayable.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2))
  });
});

export default router;