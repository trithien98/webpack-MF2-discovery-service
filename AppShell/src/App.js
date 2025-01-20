import React, { lazy, Suspense } from 'react';
import { loadRemote, init, registerRemotes } from '@module-federation/runtime';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';

init({
  // remotes: [
  //   {
  //     name: 'HomeMFE',
  //     alias: 'HomeMFE',
  //     entry: 'http://localhost:2001/remoteEntry.js',
  //   }
  // ]
});
// I can call it when I want to load the remote, even inside App function
// this is the method I need for loading the remotes using the discovery service

registerRemotes([
  {
    name: 'HomeMFE',
    alias: 'HomeMFE',
    entry: 'http://localhost:2001/remoteEntry.js',
  }
]);

registerRemotes([
  {
    name: 'CatalogueMFE',
    alias: 'CatalogueMFE',
    entry: 'http://localhost:2002/remoteEntry.js',
  }
]);

const System = ({ request }) => {
  if (!request) {
    return <h2>No system specified</h2>;
  }

  const MFE = lazy(() => {
    return loadRemote(request)
      .then(module => {
        console.log('Successfully loaded module:', module);
        return module;
      })
      .catch(err => {
        console.error('Failed to load remote:', request, err);
        throw err;
      });
  });

  return (
    <Suspense fallback="Loading...">
      <MFE />
    </Suspense>
  );
};

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <Routes>
            <Route 
              path="/" 
              element={<System request="HomeMFE/MFE" />} 
            />
            <Route 
              path="/catalogue/*" 
              element={<System request="CatalogueMFE/MFE" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;