// In-memory storage
export let wallet = {
  balance: 25750,
  currency: 'PKR',
  owner: 'Mahnoor J'  // 
};

export let transactions = [];
export let loanApplications = [];

let transactionId = 1;
let loanId = 1;

// Helper to add transaction
export const addTransaction = (type, amount, description) => {
  const transaction = {
    id: transactionId++,
    type,
    amount,
    timestamp: new Date().toISOString(),
    description
  };
  transactions.unshift(transaction);
  return transaction;
};

// Helper to add loan
export const addLoan = (loanData) => {
  const loan = {
    id: loanId++,
    ...loanData,
    status: 'pending',
    appliedAt: new Date().toISOString()
  };
  loanApplications.unshift(loan);
  return loan;
};

// Helper to update loan status
export const updateLoanStatus = (id, status) => {
  const loan = loanApplications.find(l => l.id === id);
  if (loan) loan.status = status;
  return loan;
};