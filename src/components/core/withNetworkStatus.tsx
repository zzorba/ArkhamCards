import React from 'react';
import NetInfo, { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo';
import hoistNonReactStatic from 'hoist-non-react-statics';

export interface NetworkStatusProps {
  isConnected: boolean;
  networkType?: string;
  refreshNetworkStatus: () => void;
}

export default function withNetworkStatus<P>(
  WrappedComponent: React.ComponentType<P & NetworkStatusProps>
) {
  interface State {
    networkType?: NetInfoStateType;
    isConnected: boolean;
  }

  class NetworkStatusComponent extends React.Component<P, State> {
    state: State = {
      isConnected: true,
    };
    unmounted: boolean = false;
    listenerUnsubscribe?: () => void = undefined;

    componentDidMount() {
      this._refreshNetworkStatus();
      this.listenerUnsubscribe = NetInfo.addEventListener(this._networkStatusChanged);
    }

    componentWillUnmount() {
      this.unmounted = true;
      if (this.listenerUnsubscribe) {
        this.listenerUnsubscribe();
      }
    }

    _refreshNetworkStatus = () => {
      NetInfo.fetch().then(this._networkStatusChanged);
    };

    _networkStatusChanged = (state: NetInfoState) => {
      if (!this.unmounted) {
        this.setState({
          networkType: state.type,
          isConnected: state.isConnected,
        });
      }
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          isConnected={this.state.isConnected}
          networkType={this.state.networkType}
          refreshNetworkStatus={this._refreshNetworkStatus}
        />
      );
    }
  }
  hoistNonReactStatic(NetworkStatusComponent, WrappedComponent);

  return NetworkStatusComponent;
}
