import { useState, useEffect } from 'react';
import { registerRemotes, init } from '@module-federation/runtime';

const useMfeInitialization = () => {
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeMFEs = async () => {
      try {
        await init({
          name: 'shell'
        });

        const response = await fetch('http://localhost:8080/frontend-discovery.json');
        const data = await response.json();

        const remotes = [];
        const routeConfigs = [];
        
        for (const [_, configs] of Object.entries(data.microFrontends)) {
          const config = configs[0];
          const { name, alias, exposed, route } = config.extras;
          // register Module Federeation remotes
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

        registerRemotes(remotes);
        setRoutes(routeConfigs);
   
      } catch (error) {
        console.error('Failed to initialize or load micro-frontend configuration:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeMFEs();
  }, []);

  return { routes, isLoading };
};

export default useMfeInitialization; 