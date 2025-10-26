import React, { useState, useEffect, useCallback } from 'react';
import { getInstance } from '@module-federation/runtime-tools';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Loading from './Loading';
import NotificationModal from './components/NotificationModal';
import emitter from './services/eventEmitter';
import './index.css';

const System = ({ request, mfInstance }) => {
  if (!request) {
    return <h2>No system specified</h2>;
  }

  // Use simple Module Federation without React Bridge
  const MFE = React.lazy(() =>
    mfInstance.loadRemote(request)
      .then(module => ({
        default: module.default
      }))
  );

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <MFE emitter={emitter} />
    </React.Suspense>
  );
};

/**
 * Generate routes for a specific MFE
 * @param {string} name - MFE name
 * @param {string} exposed - Exposed component name
 * @param {string} route - Main route path
 * @param {string[]} routes - Optional nested routes
 * @returns {Array} Array of route configurations
 */
const generateRoutesForMFE = (name, exposed, route, routes) => {
  const routeConfigs = [];
  
  // Add nested routes FIRST (more specific routes)
  if (routes && Array.isArray(routes)) {
    routes.forEach(nestedRoute => {
      routeConfigs.push({
        path: nestedRoute,
        request: `${name}/${exposed}`
      });
    });
  }
  
  // Then add the main route (more general route)
  routeConfigs.push({
    path: route,
    request: `${name}/${exposed}`
  });
  
  return routeConfigs;
};

function App() {
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [mfInstance, setMfInstance] = useState(null);

  const initializeMFEs = useCallback(async () => {
    if (isInitialized) return;
    
    try {
      // Get the existing instance created by webpack
      const instance = getInstance();
      setMfInstance(instance);

      const response = await fetch('http://127.0.0.1:8080/frontend-discovery.json');
      const data = await response.json();

      const remotes = [];
      const routeConfigs = [];
      
      for (const [_, configs] of Object.entries(data.microFrontends)) {
        const config = configs[0];
        const { name, alias, exposed, route, routes } = config.extras;
        
        // Register the remote MFE
        remotes.push({
          name,
          alias,
          entry: config.url
        });
        
        // Generate routes for this MFE
        const mfeRoutes = generateRoutesForMFE(name, exposed, route, routes);
        routeConfigs.push(...mfeRoutes);
      }

      await instance.registerRemotes(remotes);
      
      setRoutes(routeConfigs);
      setIsInitialized(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize MFEs:', error);
      setIsLoading(false);
    }
  }, [isInitialized]);

  useEffect(() => {
    initializeMFEs();
  }, [initializeMFEs]);

  return (
    <Router>
      <div>
        <Header />
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          {isLoading ? (
            <Loading />
          ) : (
            <Routes>
              {routes.map((route, index) => (
                <Route 
                  key={index}
                  path={route.path}
                  element={<System request={route.request} mfInstance={mfInstance} />}
                />
              ))}
              <Route 
                path="*" 
                element={
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <h2>Page not found</h2>
                    <p>Current path: {window.location.pathname}</p>
                    <p>Available routes: {routes.map(r => r.path).join(', ')}</p>
                  </div>
                } 
              />
            </Routes>
          )}
        </main>
        <NotificationModal emitter={emitter} />
      </div>
    </Router>
  );
}

export default App;