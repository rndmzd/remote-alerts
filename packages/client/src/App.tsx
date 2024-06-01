import React, { useState } from 'react';
import Countdown from './Countdown';

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
  };

  return (
    <div className="App">
      <h1>Countdown Timer</h1>
      {isConnected ? (
        <Countdown />
      ) : (
        <button onClick={handleConnect}>Connect to Server</button>
      )}
    </div>
  );
};

export default App;
