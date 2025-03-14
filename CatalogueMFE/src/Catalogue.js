import React from 'react';
import { withRouter } from './withRouter';

class Catalogue extends React.Component {
  handleViewDetails = (productId) => {
    const { navigate } = this.props;
    navigate(`/product/${productId}`);
  };

  render() {
    const { location, params } = this.props;

    return (
      <div style={{ padding: '20px' }}>
        <h1>Catalogue</h1>
        <div>Current path: {location.pathname}</div>
        {params.productId && <div>Viewing product: {params.productId}</div>}
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          padding: '20px'
        }}>
          {[1, 2, 3, 4].map(id => (
            <div key={id} style={{
              border: '1px solid #ddd',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h3>Product {id}</h3>
              <button 
                onClick={() => this.handleViewDetails(id)}
                style={{
                  backgroundColor: '#4299e1',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withRouter(Catalogue); 