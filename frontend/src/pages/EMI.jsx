import { useState } from 'react';
import { api } from '../utils/api';
import { formatPKR } from '../utils/formatPKR';
import { useToast } from '../context/ToastContext';
import SkeletonLoader from '../components/SkeletonLoader';

const EMI = () => {
  const [principal, setPrincipal] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [months, setMonths] = useState('');
  const [result, setResult] = useState(null);
  const [amortization, setAmortization] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  
  const calculateEMI = async () => {
    const P = parseFloat(principal);
    const R = parseFloat(annualRate);
    const N = parseFloat(months);
    
    if (isNaN(P) || isNaN(R) || isNaN(N) || P <= 0 || R < 0 || N <= 0) {
      addToast('Please enter valid positive numbers', 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await api.calculateEMI(P, R, N);
      if (data.error) {
        addToast(data.error, 'error');
      } else {
        setResult(data);
        
        const monthlyRate = R / 100 / 12;
        let remaining = P;
        const table = [];
        
        for (let i = 1; i <= N; i++) {
          const interest = remaining * monthlyRate;
          let principalPaid = data.emi - interest;
          if (principalPaid > remaining) principalPaid = remaining;
          remaining -= principalPaid;
          
          table.push({
            month: i,
            principal: principalPaid,
            interest: interest,
            remaining: remaining > 0 ? remaining : 0
          });
          
          if (remaining <= 0.01) break;
        }
        
        setAmortization(table);
      }
    } catch (error) {
      addToast('Calculation failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const AnimatedStatCard = ({ label, value, delay = 0, color }) => {
    const [displayValue, setDisplayValue] = useState(0);
    useState(() => {
      const timer = setTimeout(() => {
        let start = 0;
        const duration = 800;
        const step = value / (duration / 10);
        const interval = setInterval(() => {
          start += step;
          if (start >= value) {
            setDisplayValue(value);
            clearInterval(interval);
          } else {
            setDisplayValue(Math.floor(start));
          }
        }, 10);
        return () => clearInterval(interval);
      }, delay);
      return () => clearTimeout(timer);
    });
    
    return (
      <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>{label}</div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: color || '#6366f1' }}>{formatPKR(displayValue)}</div>
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div style={{ paddingTop: '100px' }} className="container-premium">
        <h1>EMI Calculator</h1>
        <SkeletonLoader type="card" />
      </div>
    );
  }
  
  const totalInterest = result ? result.totalInterest : 0;
  const totalPrincipal = result ? parseFloat(principal) : 0;
  const principalPercent = totalPrincipal + totalInterest > 0 ? (totalPrincipal / (totalPrincipal + totalInterest)) * 100 : 0;
  
  return (
    <div style={{ paddingTop: '100px' }} className="fade-up">
      <div className="container-premium">
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>EMI Calculator</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Calculate your monthly loan payments instantly</p>
        
        {/* Input Card */}
        <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
          <div className="grid-premium grid-cols-3" style={{ gap: '16px' }}>
            <input
              type="number"
              className="input-premium"
              placeholder="Principal Amount (PKR)"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
            />
            <input
              type="number"
              className="input-premium"
              placeholder="Annual Interest Rate (%)"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
            />
            <input
              type="number"
              className="input-premium"
              placeholder="Tenure (months)"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
            />
            <button className="btn-premium" onClick={calculateEMI} style={{ gridColumn: 'span 3' }}>
              Calculate EMI
            </button>
          </div>
        </div>
        
        {result && (
          <>
            {/* Results Cards */}
            <div className="grid-premium grid-cols-3" style={{ marginBottom: '32px' }}>
              <AnimatedStatCard label="Monthly EMI" value={result.emi} delay={0} color="#6366f1" />
              <AnimatedStatCard label="Total Payable" value={result.totalPayable} delay={100} color="#10b981" />
              <AnimatedStatCard label="Total Interest" value={result.totalInterest} delay={200} color="#f59e0b" />
            </div>
            
            {/* Principal vs Interest Bar */}
            <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Principal vs Interest Breakdown</h3>
              <div style={{ height: '12px', background: 'var(--border-light)', borderRadius: '6px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{ width: `${principalPercent}%`, height: '100%', background: '#10b981', display: 'inline-block' }} />
                <div style={{ width: `${100 - principalPercent}%`, height: '100%', background: '#ef4444', display: 'inline-block' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span>✅ Principal: {principalPercent.toFixed(1)}% ({formatPKR(totalPrincipal)})</span>
                <span>📈 Interest: {(100 - principalPercent).toFixed(1)}% ({formatPKR(totalInterest)})</span>
              </div>
            </div>
            
            {/* Amortization Table */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Amortization Schedule</h3>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)' }}>
                    <tr>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: 'var(--text-tertiary)' }}>Month</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: 'var(--text-tertiary)' }}>Principal (PKR)</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: 'var(--text-tertiary)' }}>Interest (PKR)</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: 'var(--text-tertiary)' }}>Remaining (PKR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amortization.map((row, idx) => (
                      <tr key={row.month} style={{
                        animation: `fadeInUp 0.2s ease-out ${idx * 0.01}s both`,
                        background: idx % 2 === 0 ? 'var(--bg-tertiary)' : 'transparent'
                      }}>
                        <td style={{ padding: '12px', borderBottom: '1px solid var(--border-light)' }}>{row.month}</td>
                        <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid var(--border-light)' }}>{formatPKR(row.principal)}</td>
                        <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid var(--border-light)' }}>{formatPKR(row.interest)}</td>
                        <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid var(--border-light)' }}>{formatPKR(row.remaining)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EMI;