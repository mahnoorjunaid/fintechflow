import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { formatPKR } from '../utils/formatPKR';
import SkeletonLoader from '../components/SkeletonLoader';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchTransactions();
  }, [typeFilter]);
  
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const type = typeFilter === 'all' ? null : typeFilter;
      const data = await api.getTransactions(type);
      setTransactions(data);
      setFiltered(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    let filteredData = transactions;
    if (searchTerm) {
      filteredData = filteredData.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFiltered(filteredData);
  }, [searchTerm, transactions]);
  
  const totals = filtered.reduce((acc, t) => {
    if (t.type === 'credit') acc.credits += t.amount;
    else acc.debits += t.amount;
    acc.net = acc.credits - acc.debits;
    return acc;
  }, { credits: 0, debits: 0, net: 0 });
  
  if (isLoading) {
    return (
      <div style={{ paddingTop: '100px' }} className="container-premium">
        <h1 style={{ marginBottom: '8px' }}>Transaction History</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>View all your financial activity</p>
        {[1, 2, 3, 4, 5].map(i => <SkeletonLoader key={i} type="transaction" />)}
      </div>
    );
  }
  
  return (
    <div style={{ paddingTop: '100px' }} className="fade-up">
      <div className="container-premium">
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Transaction History</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>View all your financial activity</p>
        
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
        
        {/* Filters */}
        <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
          <div className="grid-premium grid-cols-2" style={{ gap: '16px' }}>
            <input
              type="text"
              className="input-premium"
              placeholder="🔍 Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="input-premium"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="all">All Transactions</option>
              <option value="credit">💰 Credits Only</option>
              <option value="debit">💸 Debits Only</option>
            </select>
          </div>
        </div>
        
        {/* Transaction List */}
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-light)' }}>
            <div className="grid-premium grid-cols-2" style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-tertiary)' }}>
              <div>Description</div>
              <div style={{ textAlign: 'right' }}>Amount</div>
            </div>
          </div>
          
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-tertiary)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                <p>No transactions found</p>
              </div>
            ) : (
              filtered.map((tx, idx) => (
                <div
                  key={tx.id}
                  className="transaction-row"
                  style={{
                    animationDelay: `${idx * 0.03}s`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 24px',
                    borderBottom: '1px solid var(--border-light)',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: tx.type === 'credit' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      {tx.type === 'credit' ? '⬆️' : '⬇️'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, marginBottom: '4px' }}>{tx.description}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                        {new Date(tx.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    fontWeight: 600,
                    fontSize: '16px',
                    color: tx.type === 'credit' ? '#10b981' : '#ef4444'
                  }}>
                    {tx.type === 'credit' ? '+' : '-'} {formatPKR(tx.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;