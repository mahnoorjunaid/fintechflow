import { useState, useEffect } from 'react';
import { formatPKR } from '../utils/formatPKR';

const SpendingChart = ({ transactions }) => {
  const [spendingByCategory, setSpendingByCategory] = useState({});
  const [incomeByCategory, setIncomeByCategory] = useState({});
  
  useEffect(() => {
    // Categories for spending (debits)
    const spending = {
      'Food & Dining': 0,
      'Shopping': 0,
      'Bills & Utilities': 0,
      'Entertainment': 0,
      'Transport': 0,
      'Healthcare': 0,
      'Education': 0,
      'Rent': 0,
      'Groceries': 0,
      'Other Spending': 0
    };
    
    // Categories for income (credits)
    const income = {
      'Salary': 0,
      'Transfer': 0,
      'Refund': 0,
      'Gift': 0,
      'Investment': 0,
      'Other Income': 0
    };
    
    transactions.forEach(tx => {
      const desc = tx.description.toLowerCase();
      const amount = tx.amount;
      
      if (tx.type === 'debit') {
        // SPENDING - categorize based on keywords in description
        if (desc.includes('food') || desc.includes('restaurant') || desc.includes('cafe') || desc.includes('dining') || desc.includes('🍕')) {
          spending['Food & Dining'] += amount;
        }
        else if (desc.includes('shopping') || desc.includes('store') || desc.includes('mall') || desc.includes('🛍️')) {
          spending['Shopping'] += amount;
        }
        else if (desc.includes('bill') || desc.includes('utility') || desc.includes('electricity') || desc.includes('gas') || desc.includes('water') || desc.includes('wifi') || desc.includes('💡')) {
          spending['Bills & Utilities'] += amount;
        }
        else if (desc.includes('movie') || desc.includes('game') || desc.includes('netflix') || desc.includes('spotify') || desc.includes('cinema') || desc.includes('🎬')) {
          spending['Entertainment'] += amount;
        }
        else if (desc.includes('fuel') || desc.includes('petrol') || desc.includes('taxi') || desc.includes('uber') || desc.includes('car') || desc.includes('transport') || desc.includes('🚗')) {
          spending['Transport'] += amount;
        }
        else if (desc.includes('doctor') || desc.includes('hospital') || desc.includes('medicine') || desc.includes('health') || desc.includes('🏥')) {
          spending['Healthcare'] += amount;
        }
        else if (desc.includes('course') || desc.includes('university') || desc.includes('school') || desc.includes('book') || desc.includes('education') || desc.includes('📚')) {
          spending['Education'] += amount;
        }
        else if (desc.includes('rent') || desc.includes('mortgage') || desc.includes('apartment') || desc.includes('🏠')) {
          spending['Rent'] += amount;
        }
        else if (desc.includes('grocery') || desc.includes('supermarket') || desc.includes('vegetable') || desc.includes('🛒')) {
          spending['Groceries'] += amount;
        }
        else {
          // If no category matched, check if it's a custom description or put in Other
          if (desc.includes('withdrawal')) {
            // Generic withdrawal without category
            spending['Other Spending'] += amount;
          } else {
            spending['Other Spending'] += amount;
          }
        }
      } 
      else if (tx.type === 'credit') {
        // INCOME - categorize based on description
        if (desc.includes('salary') || desc.includes('income') || desc.includes('paycheck')) {
          income['Salary'] += amount;
        }
        else if (desc.includes('transfer') || desc.includes('bank')) {
          income['Transfer'] += amount;
        }
        else if (desc.includes('refund') || desc.includes('return')) {
          income['Refund'] += amount;
        }
        else if (desc.includes('gift') || desc.includes('present')) {
          income['Gift'] += amount;
        }
        else if (desc.includes('investment') || desc.includes('stock') || desc.includes('profit')) {
          income['Investment'] += amount;
        }
        else {
          income['Other Income'] += amount;
        }
      }
    });
    
    // Remove zero-value categories
    const filteredSpending = Object.fromEntries(
      Object.entries(spending).filter(([_, value]) => value > 0)
    );
    
    const filteredIncome = Object.fromEntries(
      Object.entries(income).filter(([_, value]) => value > 0)
    );
    
    setSpendingByCategory(filteredSpending);
    setIncomeByCategory(filteredIncome);
  }, [transactions]);
  
  const totalSpending = Object.values(spendingByCategory).reduce((a, b) => a + b, 0);
  const totalIncome = Object.values(incomeByCategory).reduce((a, b) => a + b, 0);
  
  const hasData = totalSpending > 0 || totalIncome > 0;
  
  if (!hasData) {
    return (
      <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
        <h3 style={{ marginBottom: '8px' }}>No Transaction Data Yet</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Make some deposits or withdrawals to see your analytics!
        </p>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', marginTop: '8px' }}>
          💡 Tip: Use the category dropdown when making transactions for better insights
        </p>
      </div>
    );
  }
  
  return (
    <div className="card card-hover" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          📊 Spending & Income Analytics
        </h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span className="badge badge-info">Total Spending: {formatPKR(totalSpending)}</span>
          <span className="badge badge-success">Total Income: {formatPKR(totalIncome)}</span>
        </div>
      </div>
      
      {/* Two column layout for Spending and Income */}
      <div className="grid grid-2" style={{ gap: '24px' }}>
        {/* Spending Section */}
        <div>
          <h4 style={{ marginBottom: '16px', color: 'var(--error)' }}>💸 Spending Breakdown</h4>
          {Object.keys(spendingByCategory).length === 0 ? (
            <p style={{ color: 'var(--text-tertiary)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
              No spending data yet
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {Object.entries(spendingByCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount]) => {
                  const percentage = (amount / totalSpending) * 100;
                  return (
                    <div key={category}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                        <span style={{ fontWeight: 500 }}>{category}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {formatPKR(amount)} <span style={{ fontWeight: 600, color: 'var(--error)' }}>({percentage.toFixed(1)}%)</span>
                        </span>
                      </div>
                      <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div 
                          style={{
                            width: `${percentage}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #ef4444, #dc2626)',
                            borderRadius: '4px',
                            transition: 'width 0.8s ease'
                          }} 
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
        
        {/* Income Section */}
        <div>
          <h4 style={{ marginBottom: '16px', color: 'var(--success)' }}>💰 Income Breakdown</h4>
          {Object.keys(incomeByCategory).length === 0 ? (
            <p style={{ color: 'var(--text-tertiary)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
              No income data yet
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {Object.entries(incomeByCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount]) => {
                  const percentage = (amount / totalIncome) * 100;
                  return (
                    <div key={category}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                        <span style={{ fontWeight: 500 }}>{category}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {formatPKR(amount)} <span style={{ fontWeight: 600, color: 'var(--success)' }}>({percentage.toFixed(1)}%)</span>
                        </span>
                      </div>
                      <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div 
                          style={{
                            width: `${percentage}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #10b981, #059669)',
                            borderRadius: '4px',
                            transition: 'width 0.8s ease'
                          }} 
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
      
      {/* Summary Insight */}
      {totalSpending > 0 && totalIncome > 0 && (
        <div style={{ 
          marginTop: '24px', 
          padding: '16px', 
          background: 'var(--primary-glow)', 
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            📈 Monthly Summary: You've saved{' '}
            <strong style={{ color: totalIncome - totalSpending >= 0 ? 'var(--success)' : 'var(--error)' }}>
              {formatPKR(Math.abs(totalIncome - totalSpending))}
            </strong>{' '}
            {totalIncome - totalSpending >= 0 ? 'this month! 🎉' : 'more than you earned. 💡'}
          </span>
        </div>
      )}
    </div>
  );
};

export default SpendingChart;