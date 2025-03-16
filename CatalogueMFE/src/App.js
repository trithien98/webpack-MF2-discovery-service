import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ProductDetails from './ProductDetails';

const ProductList = () => {
    const products = [
        { id: 1, title: 'Cosmic Cat T-Shirt', price: '$25.99', image: 'https://picsum.photos/seed/cat/300/300' },
        { id: 2, title: 'Pizza Ninja T-Shirt', price: '$23.99', image: 'https://picsum.photos/seed/ninja/300/300' },
        { id: 3, title: 'Pixel Gaming T-Shirt', price: '$24.99', image: 'https://picsum.photos/seed/pixel/300/300' },
        { id: 4, title: 'Robot DJ T-Shirt', price: '$26.99', image: 'https://picsum.photos/seed/robot/300/300' },
    ];

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Our T-Shirt Collection</h2>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '2rem',
                padding: '1rem'
            }}>
                {products.map(product => (
                    <div 
                        key={product.id} 
                        style={{ 
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '1rem',
                            textAlign: 'center'
                        }}
                    >
                        <img 
                            src={product.image} 
                            alt={product.title}
                            style={{ 
                                width: '100%',
                                borderRadius: '4px',
                                marginBottom: '1rem'
                            }}
                        />
                        <h3>{product.title}</h3>
                        <p>{product.price}</p>
                        <Link 
                            to={`${product.id}`}
                            style={{
                                backgroundColor: '#4299e1',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                textDecoration: 'none',
                                display: 'inline-block'
                            }}
                        >
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

class App extends React.Component {
    render() {

        return (
            <>
                <div style={{
                    backgroundColor: '#f0f9ff',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    marginBottom: '1rem',
                    display: 'inline-block'
                }}>
                    React v{React.version}
                </div>
                <Routes>
                    <Route path=":id" element={<ProductDetails />} />
                    <Route path="/*" element={<ProductList />} />
                </Routes>
            </>
        );
    }
}

export default App;