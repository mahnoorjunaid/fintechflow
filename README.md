# 💳 FintechFlow — Personal Finance Management App

> A full-stack personal finance web application built with React + Node.js/Express for the Web Programming course at FAST-NUCES.

**Student:** Mahnoor Junaid
**Roll Number:** 23i-5561
**Course:** Web Programming — FAST-NUCES

---

## 📌 Project Description

FintechFlow is a browser-based personal finance management system that simulates core banking operations. It allows a user to manage their wallet, track transactions, apply for loans, review loan statuses, and calculate EMI payments — all through a modern, animated UI with glassmorphism design.

Think of it as a simplified, single-user version of apps like JazzCash or Easypaisa, built entirely with React on the frontend and Express.js on the backend.

### ✨ Features

| Feature | Description |
|---|---|
| 💰 Wallet Dashboard | View balance, deposit, and withdraw with animated balance counter and glow effects |
| 📋 Transaction History | Searchable, filterable list of all transactions with credit/debit summaries |
| 📝 Loan Application | 3-step form with CNIC validation, loan purpose, and tenure selection |
| 🔄 Loan Status Viewer | 3D flip cards showing loan details; approve/reject pending loans |
| 🧮 EMI Calculator | Calculates monthly EMI, total payable, total interest, and full amortization table |
| 💱 Currency Converter | Convert foreign currencies (USD, GBP, EUR, AED, etc.) to PKR *(Bonus)* |
| 🎯 Savings Goals Tracker | Create and fund savings goals with circular progress indicators *(Bonus)* |
| 🌙 Dark / Light Mode | Theme toggle with localStorage persistence |
| 📱 Responsive Design | Works on mobile, tablet, and desktop |

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or above)
- npm

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/fintechflow.git
cd fintechflow

# 2. Start the Backend
cd backend
npm install
npm start
# Backend runs on http://localhost:5000

# 3. Open a new terminal, then start the Frontend
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000

# 4. Open your browser and go to:
# http://localhost:3000
```

> **Note:** Keep both terminals running at the same time. The frontend calls the backend on port 5000. All data is stored in-memory and resets when the backend server restarts.

---

## 🔌 API Endpoints

Base URL (local): `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/wallet` | Get current wallet balance and owner info |
| `POST` | `/wallet/deposit` | Deposit money into the wallet |
| `POST` | `/wallet/withdraw` | Withdraw money from the wallet |
| `GET` | `/transactions` | Get all transaction records (newest first) |
| `POST` | `/loans/apply` | Submit a new loan application |
| `GET` | `/loans` | Get all loan applications |
| `PATCH` | `/loans/:id/status` | Update the status of a loan (Approve / Reject) |
| `GET` | `/emi-calculator` | Calculate EMI given principal, rate, and tenure |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React.js 18.2 |
| Build Tool | Vite 5.0 |
| Routing | React Router v6 |
| Backend | Node.js + Express.js |
| Styling | Custom CSS (Glassmorphism) |
| HTTP Client | Fetch API (native browser) |
| Storage | In-memory (no database) |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |

---

## 🌐 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | `https://fintechflow.vercel.app` |
| Backend | Render | `https://fintechflow-backend.onrender.com` |

> Set the environment variable `VITE_API_URL` in Vercel to point to your Render backend URL + `/api`.

---

## ⚠️ Known Limitations

- All data resets on backend restart (no persistent database)
- Currency exchange rates are static (no live API)
- Savings goals persist in `localStorage` only (browser-specific)
- No user authentication — single-user application

---

## ✅ Assignment Checklist

- [x] 8 working API endpoints
- [x] Express Router structure (`wallet.js` + `loans.js`)
- [x] React functional components with Hooks
- [x] Custom `useCountUp` hook
- [x] Multi-step loan form with CNIC validation
- [x] 3D flip cards for loan status
- [x] EMI calculator with amortization table
- [x] Dark/Light mode with localStorage
- [x] Custom toast notifications (no external library)
- [x] Skeleton loaders
- [x] Responsive design
- [x] Deployed on Vercel + Render
- [x] Bonus: Currency Converter
- [x] Bonus: Savings Goals Tracker

---

*Built by Mahnoor Junaid (23i-5561) — FAST-NUCES*
