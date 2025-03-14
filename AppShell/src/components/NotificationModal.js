import React from 'react';

class NotificationModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      type: 'info',
      title: '',
      message: ''
    };
  }

  componentDidMount() {
    const { emitter } = this.props;
    emitter.on('notification', this.handleNotification);
  }

  componentWillUnmount() {
    const { emitter } = this.props;
    emitter.off('notification', this.handleNotification);
  }

  handleNotification = ({ type, title, message }) => {
    console.log('Notification received:', { type, title, message });
    this.setState({
      isOpen: true,
      type,
      title,
      message
    });
  };

  handleClose = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const { isOpen, type, title, message } = this.state;

    if (!isOpen) return null;

    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: type === 'success' ? '#48bb78' : '#4299e1',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '300px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{title}</div>
        <div>{message}</div>
        <button 
          onClick={this.handleClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
      </div>
    );
  }
}

export default NotificationModal; 