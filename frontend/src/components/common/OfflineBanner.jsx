import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineBanner = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-rose-600 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md">
      <WifiOff className="w-4 h-4 animate-bounce" />
      <span>You are currently offline. Live queue updates and payments are paused until connectivity returns.</span>
    </div>
  );
};

export default OfflineBanner;
