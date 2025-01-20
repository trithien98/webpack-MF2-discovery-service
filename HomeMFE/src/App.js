import React from "react";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <h1>Homepage Remote</h1>
      <div className="hero" style={{
        position: 'relative',
        height: '500px',
        marginBottom: '4rem'
      }}>
        <img 
          src="https://picsum.photos/seed/tshirts/1600/500"
          alt="T-shirt collection"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '2rem',
          borderRadius: '8px'
        }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Express Yourself</h2>
          <p style={{ fontSize: '1.2rem' }}>"Life is too short to wear boring t-shirts"</p>
        </div>
      </div>

      <div className="bestsellers" style={{ marginBottom: '4rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Best Sellers</h2>
        <div style={{ 
          display: 'flex',
          overflowX: 'auto',
          gap: '2rem',
          padding: '1rem'
        }}>
          {[
            { id: 1, title: 'Cosmic Cat', image: 'https://picsum.photos/seed/cat/300/300' },
            { id: 2, title: 'Pizza Ninja', image: 'https://picsum.photos/seed/ninja/300/300' },
            { id: 3, title: 'Pixel Art Gaming', image: 'https://picsum.photos/seed/pixel/300/300' }
          ].map(product => (
            <div key={product.id} style={{ minWidth: '250px', textAlign: 'center' }}>
              <img 
                src={product.image} 
                alt={product.title}
                style={{ width: '100%', borderRadius: '8px' }}
              />
              <h3 style={{ marginTop: '1rem' }}>{product.title}</h3>
              <button 
                onClick={() => navigate(`/catalogue/product/${product.id}`)}
                style={{
                  backgroundColor: '#4299e1',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="new-arrivals">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>New Arrivals</h2>
        <div style={{ 
          display: 'flex',
          overflowX: 'auto',
          gap: '2rem',
          padding: '1rem'
        }}>
          {[
            { id: 4, title: 'Robot DJ', image: 'https://picsum.photos/seed/robot/300/300' },
            { id: 5, title: 'Zombie Unicorn', image: 'https://picsum.photos/seed/zombie/300/300' },
            { id: 6, title: 'Taco Dragon', image: 'https://picsum.photos/seed/dragon/300/300' }
          ].map(product => (
            <div key={product.id} style={{ minWidth: '250px', textAlign: 'center' }}>
              <img 
                src={product.image} 
                alt={product.title}
                style={{ width: '100%', borderRadius: '8px' }}
              />
              <h3 style={{ marginTop: '1rem' }}>{product.title}</h3>
              <button style={{
                backgroundColor: '#4299e1',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '0.5rem'
              }}>
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default App;