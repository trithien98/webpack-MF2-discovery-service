import React, { useState } from 'react';

export default function UserDetails({ request, emitter }) {
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const response = await fetch('https://run.mocky.io/v3/adbef43e-c62a-4f83-8d39-234b30b7390c');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMessage(data.msg);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Failed to fetch data');
    }
  };

  return (
    <div style={{ 
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2>User Details</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '5px',
          fontWeight: '500',
          color: '#4a5568'
        }}>
          Full Name
        </label>
        <input 
          type="text" 
          defaultValue="John Doe"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #e2e8f0',
            borderRadius: '4px'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '5px',
          fontWeight: '500',
          color: '#4a5568'
        }}>
          Email
        </label>
        <input 
          type="email" 
          defaultValue="john.doe@example.com"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #e2e8f0',
            borderRadius: '4px'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '5px',
          fontWeight: '500',
          color: '#4a5568'
        }}>
          Phone
        </label>
        <input 
          type="tel" 
          defaultValue="+1 (555) 123-4567"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #e2e8f0',
            borderRadius: '4px'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '5px',
          fontWeight: '500',
          color: '#4a5568'
        }}>
          Address
        </label>
        <textarea 
          defaultValue="123 Main St, Anytown, USA 12345"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            minHeight: '80px'
          }}
        />
      </div>
      
      <button 
        onClick={fetchData}
        style={{
          backgroundColor: '#4299e1',
          color: 'white',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: '500'
        }}
      >
        Update Details
      </button>

      {message && <p style={{ marginTop: '20px', color: '#4a5568' }}>{message}</p>}
    </div>
  );
}