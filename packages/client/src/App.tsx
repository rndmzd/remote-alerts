import React, { useState } from 'react';
import Countdown from './Countdown';

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
  };

  return (
    <div className="App">
      <h1>Alert Activation Panel</h1>
      {isConnected ? (
        <Countdown />
      ) : (
        <button onClick={handleConnect}>Arm System</button>
      )}
    </div>
  );
};

export default App;
