import { useCallback, useMemo } from 'react';
import NetInfo, { NetInfoStateType, useNetInfo } from '@react-native-community/netinfo';

export interface NetworkStatusProps {
  isConnected: boolean;
  networkType?: string;
  refreshNetworkStatus: () => void;
}

interface NetworkState {
  networkType?: NetInfoStateType;
  isConnected: boolean;
}
export default function useNetworkStatus(): [NetworkState, () => void] {
  const netInfo = useNetInfo();
  const refreshNetworkStatus = useCallback(() => {
    NetInfo.fetch();
  }, []);

  const networkState = useMemo((): NetworkState => {
    return {
      networkType: netInfo.type,
      isConnected: netInfo.isConnected || false,
    };
  }, [netInfo]);
  return [networkState, refreshNetworkStatus];
}
