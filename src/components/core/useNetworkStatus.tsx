import { useCallback, useEffect, useState } from 'react';
import NetInfo, { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo';

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
  const [networkState, setNetworkState] = useState<NetworkState>({ isConnected: true });

  useEffect(() => {
    let canceled = false;
    const updateNetworkState = (state: NetInfoState) => {
      if (!canceled) {
        setNetworkState({
          networkType: state.type,
          isConnected: state.isConnected,
        });
      }
    };
    const refreshNetworkStatus = () => {
      NetInfo.fetch().then(updateNetworkState);
    };

    const unregister = NetInfo.addEventListener(refreshNetworkStatus);
    return () => {
      canceled = true;
      unregister();
    };
  }, [setNetworkState]);

  const refreshNetworkStatus = useCallback(() => {
    NetInfo.fetch().then(state => {
      setNetworkState({
        networkType: state.type,
        isConnected: state.isConnected,
      });
    });
  }, [setNetworkState]);

  return [networkState, refreshNetworkStatus];
}
