import React, { lazy, Suspense } from 'react';
import { loadRemote } from '@module-federation/runtime';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Loading from './Loading';
import useMfeInitialization from './hooks/useMfeInitialization';

const System = ({ request }) => {
  if (!request) {
    return <h2>No system specified</h2>;
  }

  const MFE = lazy(() => loadRemote(request));

  return (
    <Suspense fallback="Loading...">
      <MFE />
    </Suspense>
  );
};

const App = () => {
  const { routes, isLoading } = useMfeInitialization();

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
                  element={<System request={route.request} />}
                />
              ))}
              <Route 
                path="*" 
                element={
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <h2>Page not found</h2>
                  </div>
                } 
              />
            </Routes>
          )}
        </main>
      </div>
    </Router>
  );
};

export default App;