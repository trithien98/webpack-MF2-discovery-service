# ThreadTales Micro-Frontend Architecture

This project demonstrates a micro-frontend architecture using Module Federation, React, and various patterns for state management and component communication.

## Key Learnings

### 1. Module Federation Setup
- **Independent Deployment**: Each micro-frontend is configured as a standalone application with its own package.json, webpack configuration, and deployment pipeline. This allows teams to work independently and deploy without affecting other parts of the application.

- **Webpack Configuration**: 
  ```javascript
  // Example of proper webpack setup
  module.exports = {
    plugins: [
      new ModuleFederationPlugin({
        name: 'mfe_name',
        filename: 'remoteEntry.js',
        exposes: {
          './MFE': './src/Component'
        },
        shared: {
          react: { singleton: true },
          'react-dom': { singleton: true }
        }
      })
    ]
  }
  ```
  Proper sharing of dependencies is crucial to avoid multiple instances of React and other libraries.

- **Selective Exposure**: Only expose components that need to be accessed by other MFEs. Internal components and utilities should remain private to the MFE.

- **Configuration Matching**: The exposed paths in webpack must match the paths defined in frontend-discovery.json to ensure proper loading:
  ```json
  {
    "microFrontends": {
      "UserPaymentMethods": [{
        "url": "http://localhost:2005",
        "extras": {
          "exposed": "MFE"
        }
      }]
    }
  }
  ```

### 2. React Components Communication
- **Props Reliability**: Props are the most reliable way to pass data across MFE boundaries. They work consistently because they're just JavaScript values:
  ```javascript
  <MFE emitter={emitter} data={someData} />
  ```

- **Context Limitations**: React Context doesn't work out of the box across MFE boundaries. While it can work when using a monorepo or shared library approach, this requires:
  ```javascript
  // Shared library approach
  // shared-lib/context.js
  const MyContext = React.createContext();
  export { MyContext };
  ```
  
  However, this approach requires:
  - Strong governance around the shared library
  - Careful version management
  - Team coordination for changes
  - Clear ownership and maintenance responsibilities
  
  Consider whether the complexity of maintaining a shared context library is worth it versus using simpler prop-based or event-based communication patterns.

- **Event Emitter Usage**: Event emitters provide a decoupled communication pattern between MFEs, avoiding the need to share domain objects through props:
  ```javascript
  // Good - Decoupled communication via events
  emitter.emit('paymentMethodUpdated', { id: '123' });
  
  // Avoid - Passing domain objects creates tight coupling
  <PaymentMFE 
    userAccount={complexUserObject} 
    paymentMethods={paymentMethodsArray}
  />
  ```
  
  Benefits of event-based communication:
  - Prevents hierarchical coupling in the DOM structure
  - MFEs can communicate without knowing about each other's internal structure
  - Easier to maintain and modify individual MFEs
  - Supports pub/sub patterns across the application
  - Allows for dynamic runtime communication without predefined prop structures

- **Class Components**: In our specific setup with Module Federation 2.0, class components have proven more reliable when dealing with lifecycle methods and prop handling:
  ```javascript
  class UserPaymentMethods extends React.Component {
    componentDidMount() {
      const { emitter } = this.props;
      emitter.on('notification', this.handleNotification);
    }
  }
  ```
  This is specific to Module Federation 2.0's implementation and should not be taken as a general rule for all micro-frontend architectures. Other MFE implementations might work equally well with functional components and hooks.

### 3. State Management
- **Props-Based State**: Keeping state management simple with props helps avoid complexity and potential issues:
  ```javascript
  // Parent MFE
  <ChildMFE data={this.state.data} onUpdate={this.handleUpdate} />
  ```

- **Event Emitter Usage**: Event emitters work well for cross-MFE communication when direct prop passing isn't feasible:
  ```javascript
  // Emitting from one MFE
  emitter.emit('notification', { type: 'success', message: 'Updated!' });

  // Listening in another MFE
  emitter.on('notification', this.handleNotification);
  ```

- **Service Initialization**: Ensure services are properly initialized before use:
  ```javascript
  // In AppShell
  const emitter = new EventEmitter();
  await init({ name: 'shell' });
  ```

### 4. Component Loading
- **Suspense Usage**: Always wrap lazy-loaded MFEs with Suspense to handle loading states:
  ```javascript
  <Suspense fallback={<Loading />}>
    <MFE />
  </Suspense>
  ```

- **Loading States**: Implement meaningful loading states that maintain layout stability:
  ```javascript
  const Loading = () => (
    <div style={{ height: '400px', display: 'flex', alignItems: 'center' }}>
      <span>Loading...</span>
    </div>
  );
  ```

- **Error Boundaries**: Implement error boundaries to gracefully handle loading failures:
  ```javascript
  class ErrorBoundary extends React.Component {
    state = { hasError: false };
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
    render() {
      if (this.state.hasError) {
        return <h2>Something went wrong.</h2>;
      }
      return this.props.children;
    }
  }
  ```

### 5. Common Gotchas
- **Hook Issues with Module Federation 2.0**: React hooks can fail when using Module Federation 2.0 due to how it handles shared dependencies:
  ```javascript
  // Module Federation 2.0 specific issue
  // This might fail due to how MF 2.0 handles React initialization
  const [state, setState] = useState(initialState);
  ```
  
  This is a specific limitation of Module Federation 2.0's implementation, not a general micro-frontend issue. Other MFE architectures or different versions of Module Federation might handle hooks differently. When using MF 2.0, always verify React is properly shared in your webpack configuration:
  ```javascript
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true }
  }
  ```

- **React Instances**: Multiple React instances can cause the "Invalid hook call" error. Ensure proper sharing in webpack:
  ```javascript
  shared: {
    react: { singleton: true, requiredVersion: deps.react },
    'react-dom': { singleton: true, requiredVersion: deps['react-dom'] }
  }
  ```

- **Context Sharing**: Context needs explicit setup across MFE boundaries, often requiring prop passing instead.

- **Event Emitter Instances**: Ensure the same event emitter instance is used across all MFEs by passing it through props.

### 6. Multiple React Versions

One of the powerful features of Module Federation is the ability to run different React versions simultaneously in different MFEs. This is achieved through proper webpack configuration:

- **Isolated React Instances**: Each MFE can use its own React version by removing it from the shared dependencies:
  ```javascript
  // MFE with isolated React 17
  // webpack.config.js
  new ModuleFederationPlugin({
    name: 'UserDetailsMFE',
    filename: 'remoteEntry.js',
    exposes: {
      './MFE': './src/UserDetails',
    }
    // No shared section - React lives in its own container
  })

  // MFE using shared React 18
  // webpack.config.js
  new ModuleFederationPlugin({
    name: 'UserPaymentsMFE',
    filename: 'remoteEntry.js',
    exposes: {
      './MFE': './src/UserPaymentMethods',
    },
    shared: {
      react: { 
        singleton: true,
        eager: true,
        requiredVersion: '18.2.0'
      },
      'react-dom': { 
        singleton: true,
        eager: true,
        requiredVersion: '18.2.0'
      }
    }
  })
  ```

- **Benefits**:
  - Each React version lives in its own container scope, not in global scope
  - No version conflicts between different MFEs
  - Enables gradual migrations (e.g., React 17 to 18)
  - Teams can work independently with different React versions
  - Perfect for testing new React versions in isolation

- **Example Implementation**:
  ```javascript
  // Display React version in each MFE
  import React from 'react';

  class MyComponent extends React.Component {
    render() {
      return (
        <div>
          <div style={{
            backgroundColor: '#f0f9ff',
            padding: '0.5rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            display: 'inline-block'
          }}>
            React v{React.version}
          </div>
          {/* Rest of component */}
        </div>
      );
    }
  }
  ```

This configuration demonstrates how Module Federation enables true independence between MFEs, allowing different versions of core dependencies to coexist without conflict. 

### 7. Inspecting Shared Resources

Module Federation 2.0 provides a way to inspect shared resources through the browser's developer tools. All shared resources are available in:

```javascript
window.__FEDERATION__.__SHARE__
```

This object contains:
- All shared dependencies organized by MFE name
- Version information for each shared resource
- Current state of shared modules

For example, you can inspect:
```javascript
// See all shared resources for HomeMFE
window.__FEDERATION__.__SHARE__.HomeMFE

// See all shared resources for UserDetailsMFE
window.__FEDERATION__.__SHARE__.UserDetailsMFE
```

This is particularly useful for:
- Debugging shared dependencies
- Verifying correct version sharing
- Confirming proper isolation of React versions (e.g., React 17 vs 18)
- Understanding how Module Federation manages shared resources at runtime

Example of what you might see:
```javascript
window.__FEDERATION__.__SHARE__.UserDetailsMFE
{
  'react17': { /* React 17 instance details */ },
  'react17-dom': { /* ReactDOM 17 instance details */ }
}

window.__FEDERATION__.__SHARE__.UserPaymentsMFE
{
  'react': { /* React 18 instance details */ },
  'react-dom': { /* ReactDOM 18 instance details */ }
}
```

This inspection capability is essential for debugging and verifying proper sharing configuration in your micro-frontend architecture. 

## Important Note About asyncStartup

⚠️ As of today, the `asyncStartup` feature from `@module-federation/enhanced` only works with RSPack and is not compatible with webpack. If you're using webpack, you'll need to use alternative initialization approaches like `eager: true` or implement custom initialization logic.