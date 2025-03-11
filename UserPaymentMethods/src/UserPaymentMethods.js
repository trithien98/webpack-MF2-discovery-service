import React from 'react';

const initialPaymentMethods = [
  {
    id: 1,
    type: 'Visa',
    last4: '4242',
    expiryMonth: '12',
    expiryYear: '2024',
    isDefault: true,
  },
  {
    id: 2,
    type: 'Mastercard',
    last4: '5555',
    expiryMonth: '03',
    expiryYear: '2025',
    isDefault: false,
  },
  {
    id: 3,
    type: 'American Express',
    last4: '0005',
    expiryMonth: '08',
    expiryYear: '2026',
    isDefault: false,
  },
];

class UserPaymentMethods extends React.Component {
  state = {
    paymentMethods: initialPaymentMethods
  };

  handleMakeDefault = (id) => {
    this.setState(state => ({
      paymentMethods: state.paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    }), () => {
      const newDefault = this.state.paymentMethods.find(method => method.id === id);
      
      // Emit the event for MyAccount
      if (this.props.emitter) {
        this.props.emitter.emit('payment-method-changed', newDefault);
      }

      // Show notification through AppShell
      if (this.props.notificationService) {
        this.props.notificationService.showNotification(
          'Payment Method Updated',
          `Your default payment method has been changed to ${newDefault.type} ending in ${newDefault.last4}`
        );
      }
    });
  };

  render() {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Payment Methods</h2>
        <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
          {this.state.paymentMethods.map((method) => (
            <div
              key={method.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '500' }}>
                    {method.type} ending in {method.last4}
                  </div>
                  <div style={{ color: '#666', marginTop: '5px' }}>
                    Expires {method.expiryMonth}/{method.expiryYear}
                  </div>
                </div>
                <div>
                  {method.isDefault ? (
                    <span
                      style={{
                        backgroundColor: '#e6f4ea',
                        color: '#1e7e34',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        fontSize: '14px',
                      }}
                    >
                      Default
                    </span>
                  ) : (
                    <button
                      onClick={() => this.handleMakeDefault(method.id)}
                      style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      Make Default
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default UserPaymentMethods;