import React, { lazy, Suspense } from 'react';
import { loadRemote, init, registerRemotes } from '@module-federation/runtime';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Loading from './Loading';
import NotificationModal from './components/NotificationModal';
import { notificationService } from './services/notificationService';
import './index.css';

const System = ({ request }) => {
  if (!request) {
    return <h2>No system specified</h2>;
  }

  const MFE = lazy(() => 
    loadRemote(request)
      .then(module => {
        const Component = module.default;
        return {
          default: (props) => React.createElement(Component, props)
        };
      })
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MFE notificationService={notificationService} />
    </Suspense>
  );
};

class App extends React.Component {
  state = {
    routes: [],
    isLoading: true,
    notification: null
  };

  async componentDidMount() {
    // Add notification listener
    notificationService.on('notification', this.handleNotification);
    
    // Initialize MFEs
    try {
      await this.initializeMFEs();
    } catch (error) {
      console.error('Failed to initialize MFEs:', error);
    }
  }

  componentWillUnmount() {
    notificationService.off('notification', this.handleNotification);
  }

  handleNotification = ({ title, message }) => {
    this.setState({ notification: { title, message } });
  };

  closeNotification = () => {
    this.setState({ notification: null });
  };

  initializeMFEs = async () => {
    try {
      await init({
        name: 'shell',
      });

      const response = await fetch('http://127.0.0.1:8080/frontend-discovery.json');
      const data = await response.json();

      const remotes = [];
      const routeConfigs = [];
      
      for (const [_, configs] of Object.entries(data.microFrontends)) {
        const config = configs[0];
        const { name, alias, exposed, route } = config.extras;
        // register Module Federation remotes
        remotes.push({
          name,
          alias,
          entry: config.url
        });
        // create dynamic routes for micro-frontends
        routeConfigs.push({
          path: route,
          request: `${name}/${exposed}`
        });
      }

      await registerRemotes(remotes);
      this.setState({ 
        routes: routeConfigs,
        isLoading: false 
      });
    } catch (error) {
      console.error('Failed to initialize or load micro-frontend configuration:', error);
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { routes, isLoading, notification } = this.state;

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

          <NotificationModal
            isOpen={!!notification}
            onClose={this.closeNotification}
            title={notification?.title}
            message={notification?.message}
          />
        </div>
      </Router>
    );
  }
}

export default App;