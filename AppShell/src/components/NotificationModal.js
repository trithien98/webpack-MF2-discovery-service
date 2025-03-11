import React from 'react';

const NotificationModal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1001
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '400px',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
        
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>{title}</h2>
        
        <div style={{
          marginBottom: '1.5rem',
          color: '#4a5568'
        }}>
          {message}
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#4299e1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default NotificationModal; 