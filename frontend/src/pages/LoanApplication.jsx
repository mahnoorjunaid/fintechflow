import { useState } from 'react';
import { api } from '../utils/api';
import { useToast } from '../context/ToastContext';
import { formatPKR } from '../utils/formatPKR';

const LoanApplication = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    applicant: '',
    cnic: '',
    contact: '',
    amount: '',
    purpose: '',
    tenure: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loanId, setLoanId] = useState(null);
  const { addToast } = useToast();
  
  const purposes = [
    { value: 'Business', label: '🏢 Business Expansion' },
    { value: 'Education', label: '🎓 Education / Student Loan' },
    { value: 'Medical', label: '🏥 Medical Emergency' },
    { value: 'Personal', label: '🏠 Personal / Home Improvement' }
  ];
  
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.applicant) newErrors.applicant = 'Full name is required';
    if (!formData.cnic) newErrors.cnic = 'CNIC is required';
    else if (!/^\d{5}-\d{7}-\d$/.test(formData.cnic)) newErrors.cnic = 'CNIC must be XXXXX-XXXXXXX-X';
    if (!formData.contact) newErrors.contact = 'Contact number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    const newErrors = {};
    const amount = parseFloat(formData.amount);
    if (!formData.amount) newErrors.amount = 'Loan amount is required';
    else if (amount < 5000) newErrors.amount = 'Minimum loan amount is PKR 5,000';
    else if (amount > 5000000) newErrors.amount = 'Maximum loan amount is PKR 5,000,000';
    if (!formData.purpose) newErrors.purpose = 'Please select a loan purpose';
    if (!formData.tenure) newErrors.tenure = 'Tenure is required';
    else if (formData.tenure < 3) newErrors.tenure = 'Minimum tenure is 3 months';
    else if (formData.tenure > 60) newErrors.tenure = 'Maximum tenure is 60 months';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
  };
  
  const prevStep = () => setStep(step - 1);
  
  const handleSubmit = async () => {
    try {
      const result = await api.applyLoan({
        ...formData,
        amount: parseFloat(formData.amount),
        tenure: parseInt(formData.tenure)
      });
      
      if (result.error) {
        addToast(result.error, 'error');
      } else {
        setLoanId(result.loanId);
        setSubmitted(true);
        addToast('Loan application submitted successfully!', 'success');
      }
    } catch (error) {
      addToast('Submission failed', 'error');
    }
  };
  
  if (submitted) {
    return (
      <div style={{ paddingTop: '100px' }} className="fade-up">
        <div className="container-premium">
          <div className="glass-card" style={{ textAlign: 'center', padding: '48px', maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
            <h2 style={{ marginBottom: '16px' }}>Application Submitted!</h2>
            <div className="glass-card" style={{ display: 'inline-block', marginBottom: '24px', padding: '16px 24px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Your Loan ID</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#6366f1' }}>#{loanId}</div>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Your application is under review. You'll be notified once approved.
            </p>
            <button className="btn-premium" onClick={() => window.location.reload()}>
              Apply for Another Loan
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const progress = (step / 3) * 100;
  
  return (
    <div style={{ paddingTop: '100px' }} className="fade-up">
      <div className="container-premium" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Apply for a Loan</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', textAlign: 'center' }}>
          Get instant financing for your needs
        </p>
        
        {/* Progress Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <span style={{ color: step >= 1 ? '#6366f1' : '' }}>Personal Info</span>
            <span style={{ color: step >= 2 ? '#6366f1' : '' }}>Loan Details</span>
            <span style={{ color: step >= 3 ? '#6366f1' : '' }}>Review</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'var(--border-light)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--gradient-primary)', transition: 'width 0.3s ease' }} />
          </div>
        </div>
        
        {/* Form Card */}
        <div className="glass-card" style={{ padding: '32px' }}>
          {step === 1 && (
            <div className="slide-right">
              <h3 style={{ marginBottom: '24px', fontSize: '20px' }}>Personal Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <input
                    type="text"
                    className="input-premium"
                    value={formData.applicant}
                    onChange={(e) => setFormData({...formData, applicant: e.target.value})}
                    placeholder="Full Name"
                  />
                  {errors.applicant && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.applicant}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    className="input-premium"
                    value={formData.cnic}
                    onChange={(e) => setFormData({...formData, cnic: e.target.value})}
                    placeholder="CNIC (XXXXX-XXXXXXX-X)"
                  />
                  {errors.cnic && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.cnic}</p>}
                </div>
                <div>
                  <input
                    type="tel"
                    className="input-premium"
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    placeholder="Contact Number"
                  />
                  {errors.contact && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.contact}</p>}
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="slide-right">
              <h3 style={{ marginBottom: '24px', fontSize: '20px' }}>Loan Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <input
                    type="number"
                    className="input-premium"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="Loan Amount (PKR)"
                  />
                  {errors.amount && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.amount}</p>}
                </div>
                <div>
                  <select
                    className="input-premium"
                    value={formData.purpose}
                    onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="">Select Loan Purpose</option>
                    {purposes.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                  {errors.purpose && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.purpose}</p>}
                </div>
                <div>
                  <input
                    type="number"
                    className="input-premium"
                    value={formData.tenure}
                    onChange={(e) => setFormData({...formData, tenure: e.target.value})}
                    placeholder="Tenure (months)"
                  />
                  {errors.tenure && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.tenure}</p>}
                </div>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="slide-right">
              <h3 style={{ marginBottom: '24px', fontSize: '20px' }}>Review Your Application</h3>
              <div style={{ background: 'var(--bg-tertiary)', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Full Name</p>
                    <p style={{ fontWeight: 500 }}>{formData.applicant}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>CNIC</p>
                    <p style={{ fontWeight: 500 }}>{formData.cnic}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Contact</p>
                    <p style={{ fontWeight: 500 }}>{formData.contact}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Loan Amount</p>
                    <p style={{ fontWeight: 500, color: '#6366f1' }}>{formatPKR(parseFloat(formData.amount) || 0)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Purpose</p>
                    <p style={{ fontWeight: 500 }}>{formData.purpose}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Tenure</p>
                    <p style={{ fontWeight: 500 }}>{formData.tenure} months</p>
                  </div>
                </div>
              </div>
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', padding: '12px', fontSize: '13px' }}>
                ⚡ By submitting, you agree to our loan terms and conditions.
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
            {step > 1 && (
              <button className="btn-premium" onClick={prevStep} style={{ background: 'var(--text-tertiary)' }}>
                ← Back
              </button>
            )}
            {step < 3 && (
              <button className="btn-premium" onClick={nextStep} style={{ marginLeft: step > 1 ? 'auto' : 0 }}>
                Continue →
              </button>
            )}
            {step === 3 && (
              <button className="btn-premium" onClick={handleSubmit} style={{ marginLeft: 'auto' }}>
                Submit Application ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;