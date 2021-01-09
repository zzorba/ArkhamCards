import React, { useCallback, useEffect, useState } from 'react';
import NetInfo, { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo';
import hoistNonReactStatic from 'hoist-non-react-statics';

export interface NetworkStatusProps {
  isConnected: boolean;
  networkType?: string;
  refreshNetworkStatus: () => void;
}

interface NetworkState {
  networkType?: NetInfoStateType;
  isConnected: boolean;
}
export function useNetworkStatus(): [NetworkState, () => void] {
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


export default function withNetworkStatus<P>(
  WrappedComponent: React.ComponentType<P & NetworkStatusProps>
) {

  function NetworkStatusComponent(props: P) {
    const [state, refreshNetworkStatus] = useNetworkStatus();
    return (
      <WrappedComponent
        {...props}
        isConnected={state.isConnected}
        networkType={state.networkType}
        refreshNetworkStatus={refreshNetworkStatus}
      />
    );
  }
  hoistNonReactStatic(NetworkStatusComponent, WrappedComponent);
  return NetworkStatusComponent;
}
