import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { formatPKR } from '../utils/formatPKR';
import { useToast } from '../context/ToastContext';
import SkeletonLoader from '../components/SkeletonLoader';

const LoanStatus = () => {
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const { addToast } = useToast();
  
  useEffect(() => {
    fetchLoans();
  }, []);
  
  const fetchLoans = async () => {
    setIsLoading(true);
    try {
      const data = await api.getLoans();
      setLoans(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateStatus = async (id, status) => {
    try {
      const result = await api.updateLoanStatus(id, status);
      if (result.error) {
        addToast(result.error, 'error');
      } else {
        setLoans(prev => prev.map(loan =>
          loan.id === id ? { ...loan, status } : loan
        ));
        addToast(`Loan ${status} successfully!`, 'success');
      }
    } catch (error) {
      addToast('Update failed', 'error');
    }
  };
  
  const sortedLoans = [...loans].sort((a, b) => {
    if (sortBy === 'amount-high') return b.amount - a.amount;
    if (sortBy === 'amount-low') return a.amount - b.amount;
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    return new Date(b.appliedAt) - new Date(a.appliedAt);
  });
  
  const counts = loans.reduce((acc, loan) => {
    acc[loan.status] = (acc[loan.status] || 0) + 1;
    return acc;
  }, { pending: 0, approved: 0, rejected: 0 });
  
  const AnimatedCount = ({ target }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let start = 0;
      const duration = 500;
      const step = (target / duration) * 10;
      const timer = setInterval(() => {
        start += step;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 10);
      return () => clearInterval(timer);
    }, [target]);
    return <span>{count}</span>;
  };
  
  if (isLoading) {
    return (
      <div style={{ paddingTop: '100px' }} className="container-premium">
        <h1>Loan Applications</h1>
        <div className="grid-premium grid-cols-3" style={{ marginTop: '24px' }}>
          {[1,2,3].map(i => <SkeletonLoader key={i} type="loan-card" />)}
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ paddingTop: '100px' }} className="fade-up">
      <div className="container-premium">
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Loan Applications</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Track and manage your loan requests</p>
        
        {/* Summary Stats */}
        <div className="grid-premium grid-cols-3" style={{ marginBottom: '32px' }}>
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Pending</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#f59e0b' }}><AnimatedCount target={counts.pending} /></div>
          </div>
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Approved</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#10b981' }}><AnimatedCount target={counts.approved} /></div>
          </div>
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Rejected</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#ef4444' }}><AnimatedCount target={counts.rejected} /></div>
          </div>
        </div>
        
        {/* Sort Control */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <select
            className="input-premium"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ width: 'auto', padding: '8px 16px' }}
          >
            <option value="newest">Newest First</option>
            <option value="amount-high">Amount: High to Low</option>
            <option value="amount-low">Amount: Low to High</option>
            <option value="status">By Status</option>
          </select>
        </div>
        
        {/* Loan Cards Grid */}
        <div className="grid-premium grid-cols-3">
          {sortedLoans.map(loan => {
            const statusColor = loan.status === 'pending' ? '#f59e0b' : loan.status === 'approved' ? '#10b981' : '#ef4444';
            const statusGlow = loan.status === 'pending' ? '0 0 10px rgba(245, 158, 11, 0.5)' : 'none';
            
            return (
              <div key={loan.id} className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{loan.applicant}</h3>
                      <div style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: statusColor + '20',
                        color: statusColor,
                        boxShadow: statusGlow,
                      }}>
                        {loan.status.toUpperCase()}
                      </div>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Amount</div>
                      <div style={{ fontSize: '20px', fontWeight: 700 }}>{formatPKR(loan.amount)}</div>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Purpose</div>
                      <div style={{ fontSize: '14px' }}>{loan.purpose}</div>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Tenure</div>
                      <div style={{ fontSize: '14px' }}>{loan.tenure} months</div>
                    </div>
                    <div style={{ marginTop: 'auto' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                        Applied: {new Date(loan.appliedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <h4 style={{ fontSize: '18px', marginBottom: '16px' }}>Update Status</h4>
                    {loan.status === 'pending' ? (
                      <>
                        <button 
                          className="btn-premium" 
                          onClick={() => updateStatus(loan.id, 'approved')}
                          style={{ background: '#10b981', width: '100%', marginBottom: '12px' }}
                        >
                          ✅ Approve
                        </button>
                        <button 
                          className="btn-premium" 
                          onClick={() => updateStatus(loan.id, 'rejected')}
                          style={{ background: '#ef4444', width: '100%' }}
                        >
                          ❌ Reject
                        </button>
                      </>
                    ) : (
                      <p style={{ textAlign: 'center', opacity: 0.8 }}>
                        This application has been <strong>{loan.status}</strong>.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {loans.length === 0 && (
          <div className="glass-card" style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏦</div>
            <p>No loan applications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanStatus;