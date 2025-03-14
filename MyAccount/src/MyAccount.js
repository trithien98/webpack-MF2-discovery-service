import React from 'react';
import { loadRemote, init, registerRemotes } from '@module-federation/runtime';

const System = ({ request, emitter }) => {
  if (!request) return null;
  
  const MFE = React.lazy(() => loadRemote(request).then(component => {
    console.log('Loaded component:', component);
    return component;
  }));

  return (
    <React.Suspense fallback={<div style={{padding: '20px', background: '#eee'}}>
      Loading MFE...
    </div>}>
        <MFE emitter={emitter} />
    </React.Suspense>
  );
};

class MyAccount extends React.Component {
  state = {
    mfeRequests: [],
    error: null,
    isLoading: true
  };

  async componentDidMount() {
    try {

      await init({
        name: 'myAccount',
      });

      const response = await fetch('http://127.0.0.1:8080/frontend-discovery.json');
      const data = await response.json();

      const userMfes = [
        data.microFrontends.UserDetailsMFE[0],
        data.microFrontends.UserPaymentMethodsMFE[0],
      ];

      await registerRemotes(
        userMfes.map(mfe => ({
          name: mfe.extras.name,
          entry: mfe.url,
        }))
      );

      const requests = userMfes.map(mfe => `${mfe.extras.alias}/${mfe.extras.exposed}`);
      console.log('Setting requests:', requests);
      this.setState({ mfeRequests: requests, isLoading: false });
    } catch (err) {
      console.error('Error in loadMfes:', err);
      this.setState({ error: err.message, isLoading: false });
    }
  }

  render() {
    const { mfeRequests, error, isLoading } = this.state;

    if (error) {
      return <div>Error loading account components: {error}</div>;
    }

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <div style={{ padding: '20px' }}>
        <h1 style={{ marginBottom: '20px' }}>My Account</h1>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {mfeRequests.map(request => (
            <System key={request} request={request} emitter={this.props.emitter} />
          ))}
        </div>
      </div>
    );
  }
}

export default MyAccount;