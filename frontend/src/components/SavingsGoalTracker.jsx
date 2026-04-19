import { useState, useEffect } from 'react';
import { formatPKR } from '../utils/formatPKR';
import { useToast } from '../context/ToastContext';

const SavingsGoalTracker = ({ currentBalance }) => {
  const [goals, setGoals] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [contributeAmount, setContributeAmount] = useState('');
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const { addToast } = useToast();
  
  useEffect(() => {
    const saved = localStorage.getItem('fintechflow-savings-goals');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const cleanGoals = parsed.filter(goal => 
          goal && typeof goal.name === 'string' && typeof goal.target === 'number' && !isNaN(goal.target)
        );
        setGoals(cleanGoals);
      } catch (e) {
        setGoals([]);
      }
    }
  }, []);
  
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem('fintechflow-savings-goals', JSON.stringify(goals));
    }
  }, [goals]);
  
  const addGoal = () => {
    const trimmedName = newGoalName.trim();
    const target = parseFloat(newGoalTarget);
    
    if (!trimmedName) {
      addToast('Please enter a goal name', 'error');
      return;
    }
    if (isNaN(target) || target <= 0) {
      addToast('Please enter a valid target amount', 'error');
      return;
    }
    
    setGoals([...goals, { id: Date.now(), name: trimmedName, target, saved: 0, icon: '🎯' }]);
    setNewGoalName('');
    setNewGoalTarget('');
    setShowAddModal(false);
    addToast(`Goal "${trimmedName}" created! 🎯`, 'success');
  };
  
  const deleteGoal = (id) => {
    const goal = goals.find(g => g.id === id);
    setGoals(goals.filter(g => g.id !== id));
    addToast(`Goal "${goal?.name}" deleted`, 'success');
  };
  
  const contributeToGoal = () => {
    const amount = parseFloat(contributeAmount);
    if (isNaN(amount) || amount <= 0) {
      addToast('Please enter a valid amount', 'error');
      return;
    }
    if (amount > currentBalance) {
      addToast(`Insufficient balance! You have ${formatPKR(currentBalance)}`, 'error');
      return;
    }
    
    const updatedGoals = goals.map(goal => {
      if (goal.id === selectedGoal.id) {
        const newSaved = goal.saved + amount;
        if (newSaved > goal.target) {
          addToast(`Amount exceeds target! Only ${formatPKR(goal.target - goal.saved)} needed`, 'error');
          return goal;
        }
        return { ...goal, saved: newSaved };
      }
      return goal;
    });
    
    setGoals(updatedGoals);
    setShowContributeModal(false);
    addToast(`Added ${formatPKR(amount)} to ${selectedGoal.name}! 🎉`, 'success');
  };
  
  const totalSaved = goals.reduce((sum, g) => sum + (g.saved || 0), 0);
  const totalTarget = goals.reduce((sum, g) => sum + (g.target || 0), 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
  
  return (
    <div className="glass-card" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          🎯 Savings Goals
        </h3>
        <button className="btn-premium" onClick={() => setShowAddModal(true)} style={{ padding: '8px 20px' }}>
          + New Goal
        </button>
      </div>
      
      {goals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏦</div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>No savings goals yet. Start saving today!</p>
          <button className="btn-premium" onClick={() => setShowAddModal(true)}>Create Your First Goal</button>
        </div>
      ) : (
        <>
          {/* Overall Progress Ring */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <div className="circular-progress">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                <circle className="bg" cx="60" cy="60" r="54" />
                <circle 
                  className="fill" 
                  cx="60" cy="60" r="54" 
                  style={{ strokeDashoffset: 339.292 * (1 - overallProgress / 100) }}
                />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700 }}>{Math.round(overallProgress)}%</div>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Complete</div>
              </div>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>Total Saved</div>
            <div style={{ fontSize: '28px', fontWeight: 700 }}>{formatPKR(totalSaved)}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>of {formatPKR(totalTarget)}</div>
          </div>
          
          {/* Goals List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {goals.map(goal => {
              const percentage = goal.target > 0 ? (goal.saved / goal.target) * 100 : 0;
              const isCompleted = goal.saved >= goal.target;
              
              return (
                <div key={goal.id} style={{ 
                  padding: '16px', 
                  background: 'var(--bg-tertiary)', 
                  borderRadius: '16px',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '18px', marginRight: '8px' }}>{goal.icon}</span>
                      <span style={{ fontWeight: 600 }}>{goal.name}</span>
                    </div>
                    <div style={{ fontSize: '13px' }}>{formatPKR(goal.saved)} / {formatPKR(goal.target)}</div>
                  </div>
                  
                  <div style={{ height: '8px', background: 'var(--border-light)', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
                    <div style={{ width: `${Math.min(percentage, 100)}%`, height: '100%', background: 'var(--gradient-primary)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      {isCompleted ? '✓ Completed!' : `${formatPKR(goal.target - goal.saved)} remaining`}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {!isCompleted && (
                        <button className="btn-premium" onClick={() => { setSelectedGoal(goal); setShowContributeModal(true); }} style={{ padding: '6px 12px', fontSize: '12px' }}>
                          + Add
                        </button>
                      )}
                      <button onClick={() => deleteGoal(goal.id)} style={{ padding: '6px 12px', fontSize: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      
      {/* Modals */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowAddModal(false)}>
          <div className="glass-card" style={{ maxWidth: '400px', width: '90%', padding: '28px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '20px' }}>Create Savings Goal</h3>
            <input className="input-premium" placeholder="Goal name" value={newGoalName} onChange={(e) => setNewGoalName(e.target.value)} style={{ marginBottom: '12px' }} />
            <input className="input-premium" type="number" placeholder="Target amount (PKR)" value={newGoalTarget} onChange={(e) => setNewGoalTarget(e.target.value)} style={{ marginBottom: '20px' }} />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-premium" onClick={() => setShowAddModal(false)} style={{ flex: 1, background: 'var(--text-tertiary)' }}>Cancel</button>
              <button className="btn-premium" onClick={addGoal} style={{ flex: 1 }}>Create</button>
            </div>
          </div>
        </div>
      )}
      
      {showContributeModal && selectedGoal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowContributeModal(false)}>
          <div className="glass-card" style={{ maxWidth: '400px', width: '90%', padding: '28px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '8px' }}>Add to {selectedGoal.name}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Current: {formatPKR(selectedGoal.saved)} / {formatPKR(selectedGoal.target)}<br />Available: {formatPKR(currentBalance)}</p>
            <input className="input-premium" type="number" placeholder="Amount to add" value={contributeAmount} onChange={(e) => setContributeAmount(e.target.value)} style={{ marginBottom: '20px' }} />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-premium" onClick={() => setShowContributeModal(false)} style={{ flex: 1, background: 'var(--text-tertiary)' }}>Cancel</button>
              <button className="btn-premium" onClick={contributeToGoal} style={{ flex: 1 }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsGoalTracker;