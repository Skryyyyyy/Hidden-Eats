import React, { useEffect, useState } from 'react';
import { WifiOff, Activity } from 'lucide-react';

interface NetworkStatusProps {
  // Can be used to manually force a state for testing
  forceState?: 'offline' | 'slow' | 'online';
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({ forceState }) => {
  const [isOffline, setIsOffline] = useState(false);
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    // In a real app, you might hook into navigator.onLine and navigator.connection
    if (forceState) {
      setIsOffline(forceState === 'offline');
      setIsSlow(forceState === 'slow');
      return;
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Mocking slow network detection
    const connection = (navigator as any).connection;
    if (connection) {
      const handleConnectionChange = () => {
        setIsSlow(connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g');
      };
      connection.addEventListener('change', handleConnectionChange);
      handleConnectionChange(); // Check initially
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', handleConnectionChange);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [forceState]);

  if (!isOffline && !isSlow) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${isOffline ? 'bg-red-600' : 'bg-yellow-600'}`}>
      {isOffline ? <WifiOff size={20} /> : <Activity size={20} />}
      <div>
        <h4 className="text-sm font-semibold">
          {isOffline ? 'No Internet Connection' : 'Slow Network Detected'}
        </h4>
        <p className="text-xs opacity-90">
          {isOffline 
            ? 'Please check your connection.' 
            : 'Some requests may take longer than usual.'}
        </p>
      </div>
    </div>
  );
};
