import { useToast } from '../context/ToastContext';

const ToastContainer = () => {
  const { toasts } = useToast();
  
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="slide-in-right"
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            background: toast.type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '250px',
            textAlign: 'center',
            fontFamily: 'system-ui'
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;