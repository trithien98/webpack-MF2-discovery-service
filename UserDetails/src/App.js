import React from 'react';
import ReactDOM from 'react-dom';
import UserDetails from './UserDetails';
import packageJson from '../package.json';

export default function App() {
  return (
    <div>
      <div style={{ 
        backgroundColor: 'green',
        color: 'white', 
        padding: '8px', 
        borderRadius: '4px',
        marginBottom: '16px'
      }}>
        React version: {packageJson.dependencies.react} | 
        ReactDOM version: {packageJson.dependencies['react-dom']}
      </div>
      <div className="container">
        <UserDetails />
      </div>
    </div>
  );
} 