const SkeletonLoader = ({ type = 'card' }) => {
  if (type === 'transaction') {
    return (
      <div className="card" style={{ marginBottom: '12px', padding: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '12px' }}></div>
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: '16px', width: '60%', marginBottom: '8px' }}></div>
            <div className="skeleton" style={{ height: '12px', width: '40%' }}></div>
          </div>
          <div className="skeleton" style={{ width: '80px', height: '20px', borderRadius: '8px' }}></div>
        </div>
      </div>
    );
  }
  
  if (type === 'loan-card') {
    return (
      <div className="card" style={{ height: '280px', padding: '20px' }}>
        <div className="skeleton" style={{ height: '24px', width: '70%', marginBottom: '16px' }}></div>
        <div className="skeleton" style={{ height: '20px', width: '50%', marginBottom: '12px' }}></div>
        <div className="skeleton" style={{ height: '20px', width: '60%', marginBottom: '12px' }}></div>
        <div className="skeleton" style={{ height: '20px', width: '40%', marginBottom: '12px' }}></div>
        <div className="skeleton" style={{ height: '32px', width: '100%', borderRadius: '12px', marginTop: 'auto' }}></div>
      </div>
    );
  }
  
  return (
    <div className="card" style={{ padding: '24px' }}>
      <div className="skeleton" style={{ height: '100px', width: '100%', borderRadius: '12px' }}></div>
    </div>
  );
};

export default SkeletonLoader;