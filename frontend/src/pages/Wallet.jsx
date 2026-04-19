import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { formatPKR } from '../utils/formatPKR';
import { useCountUp } from '../hooks/useCountUp';
import { useToast } from '../context/ToastContext';
import CurrencyConverter from '../components/CurrencyConverter';
import SavingsGoalTracker from '../components/SavingsGoalTracker';

const Wallet = () => {
  const [wallet, setWallet] = useState({ balance: 12500, owner: 'Mahnoor J' });
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [activeTab, setActiveTab] = useState('deposit');
  const [isLoading, setIsLoading] = useState(false);
  const [balanceGlow, setBalanceGlow] = useState('');
  const [pulse, setPulse] = useState(false);
  const { addToast } = useToast();
  const animatedBalance = useCountUp(wallet.balance, 1000);
  
  const categories = {
    deposit: [
      { value: 'Salary', label: 'Salary / Income', icon: '💰' },
      { value: 'Transfer', label: 'Bank Transfer', icon: '📱' },
      { value: 'Refund', label: 'Refund', icon: '🔄' },
      { value: 'Gift', label: 'Gift', icon: '🎁' },
      { value: 'Investment', label: 'Investment', icon: '📈' },
    ],
    withdraw: [
      { value: 'Food', label: 'Food & Dining', icon: '🍕' },
      { value: 'Shopping', label: 'Shopping', icon: '🛍️' },
      { value: 'Bills', label: 'Bills & Utilities', icon: '💡' },
      { value: 'Entertainment', label: 'Entertainment', icon: '🎬' },
      { value: 'Transport', label: 'Transport', icon: '🚗' },
      { value: 'Healthcare', label: 'Healthcare', icon: '🏥' },
      { value: 'Education', label: 'Education', icon: '📚' },
      { value: 'Rent', label: 'Rent', icon: '🏠' },
    ]
  };
  
  useEffect(() => {
    fetchWallet();
  }, []);
  
  const fetchWallet = async () => {
    try {
      const data = await api.getWallet();
      setWallet(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleSubmit = async () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      addToast('Please enter a valid amount', 'error');
      return;
    }
    
    let finalDescription = description;
    if (category && !finalDescription) {
      const catList = activeTab === 'deposit' ? categories.deposit : categories.withdraw;
      const selectedCat = catList.find(c => c.value === category);
      if (selectedCat) finalDescription = selectedCat.label;
    }
    if (!finalDescription) finalDescription = activeTab === 'deposit' ? 'Deposit' : 'Withdrawal';
    
    setIsLoading(true);
    try {
      const result = activeTab === 'deposit' 
        ? await api.deposit(value, finalDescription)
        : await api.withdraw(value, finalDescription);
      
      if (result.error) {
        addToast(result.error, 'error');
      } else {
        const oldBalance = wallet.balance;
        const newBalance = result.balance;
        setWallet({ balance: newBalance, owner: wallet.owner });
        setAmount('');
        setDescription('');
        setCategory('');
        setBalanceGlow(newBalance > oldBalance ? 'balance-positive' : 'balance-negative');
        setPulse(true);
        addToast(`${activeTab === 'deposit' ? 'Deposited' : 'Withdrew'} ${formatPKR(value)} successfully!`, 'success');
        setTimeout(() => {
          setBalanceGlow('');
          setPulse(false);
        }, 500);
      }
    } catch (error) {
      addToast('Transaction failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const totals = {
    credits: 0,
    debits: 0,
    net: wallet.balance
  };
  
  const currentCategories = activeTab === 'deposit' ? categories.deposit : categories.withdraw;
  
  return (
    <div style={{ paddingTop: '100px' }} className="fade-up">
      <div className="container-premium">
        {/* Stats Cards */}
        <div className="grid-premium grid-cols-3" style={{ marginBottom: '32px' }}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Total Credits</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#10b981' }}>{formatPKR(totals.credits)}</div>
          </div>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Total Debits</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#ef4444' }}>{formatPKR(totals.debits)}</div>
          </div>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Net Balance</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#6366f1' }}>{formatPKR(totals.net)}</div>
          </div>
        </div>
        
        {/* Balance Hero Card */}
        <div className={`glass-card ${balanceGlow} ${pulse ? 'pulse-effect' : ''}`} style={{
          padding: '40px',
          textAlign: 'center',
          marginBottom: '32px',
          background: 'var(--gradient-primary)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: -50, left: -50, width: 150, height: 150, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
          <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '12px', letterSpacing: '1px' }}>TOTAL BALANCE</div>
          <div style={{ fontSize: '56px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '8px' }}>{formatPKR(animatedBalance)}</div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>Account: {wallet.owner}</div>
        </div>
        
        {/* Two Column Layout */}
        <div className="grid-premium grid-cols-2" style={{ marginBottom: '32px' }}>
          {/* Deposit/Withdraw Card */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
              <button
                onClick={() => setActiveTab('deposit')}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeTab === 'deposit' ? 'var(--gradient-primary)' : 'transparent',
                  color: activeTab === 'deposit' ? 'white' : 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                💰 Deposit
              </button>
              <button
                onClick={() => setActiveTab('withdraw')}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeTab === 'withdraw' ? 'var(--gradient-primary)' : 'transparent',
                  color: activeTab === 'withdraw' ? 'white' : 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                💸 Withdraw
              </button>
            </div>
            
            <input
              type="number"
              className="input-premium"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount in PKR"
              style={{ marginBottom: '16px' }}
            />
            
            <select
              className="input-premium"
              value={category}
              onChange={(e) => { setCategory(e.target.value); setDescription(''); }}
              style={{ marginBottom: '16px', cursor: 'pointer' }}
            >
              <option value="">Select category...</option>
              {currentCategories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
              ))}
            </select>
            
            <input
              type="text"
              className="input-premium"
              value={description}
              onChange={(e) => { setDescription(e.target.value); setCategory(''); }}
              placeholder="Or custom description..."
              style={{ marginBottom: '20px' }}
            />
            
            <button className="btn-premium" onClick={handleSubmit} disabled={isLoading} style={{ width: '100%' }}>
              {isLoading ? 'Processing...' : activeTab === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
            </button>
          </div>
          
          {/* Currency Converter */}
          <CurrencyConverter />
        </div>
        
        {/* Savings Goal Tracker */}
        <SavingsGoalTracker currentBalance={wallet.balance} />
      </div>
    </div>
  );
};

export default Wallet;