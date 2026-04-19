import { useState } from 'react';
import { formatPKR } from '../utils/formatPKR';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Realistic exchange rates (updated)
  const rates = {
    USD: 285.50,
    GBP: 360.75,
    EUR: 310.25,
    AED: 77.80,
    SAR: 76.15,
    CAD: 210.30,
    AUD: 190.45,
    CNY: 39.50,
    JPY: 1.89,
    CHF: 325.60,
    SGD: 212.80,
    MYR: 60.75,
    QAR: 78.40,
    KWD: 930.25,
    OMR: 742.50
  };
  
  const currencies = Object.keys(rates);
  
  const handleConvert = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      const result = value * rates[fromCurrency];
      setConvertedAmount(result);
      setIsLoading(false);
    }, 300);
  };
  
  return (
    <div className="glass-card" style={{ 
      padding: '24px',
      transition: 'all 0.3s ease',
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px', 
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: 'var(--gradient-secondary)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
        }}>
          💱
        </div>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Currency Converter</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', margin: 0 }}>Real-time exchange rates</p>
        </div>
        <div style={{ 
          marginLeft: 'auto',
          background: 'rgba(99, 102, 241, 0.1)',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '10px',
          fontWeight: 600,
          color: '#6366f1',
        }}>
          BONUS
        </div>
      </div>
      
      {/* Input Section */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Amount</div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="number"
            className="input-premium"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            style={{ flex: 2 }}
          />
          <select
            className="input-premium"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            style={{ flex: 1, cursor: 'pointer' }}
          >
            {currencies.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Convert Button */}
      <button 
        className="btn-premium" 
        onClick={handleConvert}
        disabled={isLoading}
        style={{ width: '100%', marginBottom: '20px' }}
      >
        {isLoading ? 'Converting...' : `Convert to PKR →`}
      </button>
      
      {/* Result */}
      {convertedAmount && (
        <div style={{ 
          marginTop: '16px',
          padding: '20px',
          background: 'var(--bg-tertiary)',
          borderRadius: '16px',
          textAlign: 'center',
          animation: 'fadeInUp 0.3s ease',
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
            {amount} {fromCurrency} =
          </div>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 700, 
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: '8px',
          }}>
            {formatPKR(convertedAmount)}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
            Rate: 1 {fromCurrency} = {formatPKR(rates[fromCurrency])}
          </div>
        </div>
      )}
      
      {/* Live Rates Ticker */}
      <div style={{ 
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-light)',
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '12px',
        }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Available for 6 countries</span>
          <span style={{ 
            fontSize: '9px', 
            background: '#10b981',
            padding: '2px 6px',
            borderRadius: '10px',
            color: 'white',
          }}>LIVE RATES</span>
        </div>
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}>
          {Object.entries(rates).slice(0, 6).map(([currency, rate]) => (
            <div key={currency} style={{ 
              background: 'var(--bg-secondary)',
              padding: '8px 12px',
              borderRadius: '12px',
              minWidth: '70px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>{currency}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{formatPKR(rate)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;