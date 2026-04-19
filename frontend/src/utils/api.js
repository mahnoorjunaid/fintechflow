const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Wallet
  getWallet: () => fetch(`${API_BASE}/wallet`).then(res => res.json()),
  deposit: (amount, description) => fetch(`${API_BASE}/wallet/deposit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, description })
  }).then(res => res.json()),
  withdraw: (amount, description) => fetch(`${API_BASE}/wallet/withdraw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, description })
  }).then(res => res.json()),
  getTransactions: (type) => fetch(`${API_BASE}/transactions${type ? `?type=${type}` : ''}`).then(res => res.json()),
  
  // Loans
  applyLoan: (data) => fetch(`${API_BASE}/loans/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  getLoans: () => fetch(`${API_BASE}/loans`).then(res => res.json()),
  updateLoanStatus: (id, status) => fetch(`${API_BASE}/loans/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  }).then(res => res.json()),
  
  // EMI
  calculateEMI: (principal, annualRate, months) => 
    fetch(`${API_BASE}/emi-calculator?principal=${principal}&annualRate=${annualRate}&months=${months}`)
      .then(res => res.json())
};