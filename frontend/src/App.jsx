import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import Wallet from './pages/Wallet';
import Transactions from './pages/Transactions';
import LoanApplication from './pages/LoanApplication';
import LoanStatus from './pages/LoanStatus';
import EMI from './pages/EMI';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="app">
          <Navbar />
          <main className="container" style={{ paddingTop: '80px' }}>
            <Routes>
              <Route path="/" element={<Wallet />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/apply-loan" element={<LoanApplication />} />
              <Route path="/loan-status" element={<LoanStatus />} />
              <Route path="/emi-calculator" element={<EMI />} />
            </Routes>
          </main>
          <ToastContainer />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;