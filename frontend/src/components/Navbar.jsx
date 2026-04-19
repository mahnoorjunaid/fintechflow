import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [hovered, setHovered] = useState(null);
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '💳' },
    { path: '/transactions', label: 'Transactions', icon: '📊' },
    { path: '/apply-loan', label: 'Loans', icon: '🏦' },
    { path: '/loan-status', label: 'My Loans', icon: '📋' },
    { path: '/emi-calculator', label: 'EMI', icon: '🧮' }
  ];
  
  return (
    <nav style={{
      position: 'fixed',
      top: 16,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)',
      maxWidth: '1400px',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(12px)',
      border: '1px solid var(--border-light)',
      borderRadius: '60px',
      padding: '6px 20px',
      zIndex: 100,
      boxShadow: 'var(--shadow-lg)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* Premium Logo with SVG - Option 2 Style */}
        <NavLink to="/" style={{ textDecoration: 'none' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            background: 'var(--gradient-primary)',
            padding: '6px 20px 6px 12px',
            borderRadius: '40px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.2)';
          }}>
            {/* Professional SVG Logo - Fintech Flow Icon */}
            <div style={{
              width: '38px',
              height: '38px',
              background: 'white',
              borderRadius: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(255,255,255,0.5)',
            }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="2" fill="#6366F1"/>
            </svg>
            </div>
            
            {/* Text */}
            <div>
              <div style={{
                fontSize: '18px',
                fontWeight: 800,
                color: 'white',
                letterSpacing: '-0.5px',
              }}>
                FintechFlow
              </div>
              <div style={{
                fontSize: '8px',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.7)',
                letterSpacing: '1px',
              }}>
                Made by 23I-5561
              </div>
            </div>
          </div>
        </NavLink>
        
        {/* Nav Links */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onMouseEnter={() => setHovered(item.path)}
              onMouseLeave={() => setHovered(null)}
              style={({ isActive }) => ({
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '40px',
                background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                color: isActive ? '#6366f1' : 'var(--text-secondary)',
                fontWeight: 500,
                fontSize: '14px',
                transition: 'all 0.2s ease',
                transform: hovered === item.path ? 'translateY(-1px)' : 'translateY(0)',
              })}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
          
          <button
            onClick={toggleTheme}
            style={{
              padding: '8px 16px',
              borderRadius: '40px',
              border: '1px solid var(--border-light)',
              background: 'transparent',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              marginLeft: '8px',
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.borderColor = '#6366f1';
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'var(--border-light)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;