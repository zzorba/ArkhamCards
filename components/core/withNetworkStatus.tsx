import React from 'react';
import NetInfo from '@react-native-community/netinfo';
import hoistNonReactStatic from 'hoist-non-react-statics';

export interface NetworkStatusProps {
  networkType?: string;
  refreshNetworkStatus: () => void;
}

export default function withNetworkStatus<P>(
  WrappedComponent: React.ComponentType<P & NetworkStatusProps>
) {
  interface State {
    networkType?: string;
  }

  class NetworkStatusComponent extends React.Component<P, State> {
    state: State = {};
    unmounted: boolean = false;

    componentDidMount() {
      this._refreshNetworkStatus();
      NetInfo.addEventListener('connectionChange', this._refreshNetworkStatus);
    }

    componentWillUnmount() {
      this.unmounted = true;
      NetInfo.removeEventListener('connectionChange', this._refreshNetworkStatus);
    }

    _refreshNetworkStatus = () => {
      NetInfo.getConnectionInfo().then(this._networkStatusChanged);
    };

    _networkStatusChanged = (connectionInfo: NetInfo.NetInfoData) => {
      if (!this.unmounted) {
        this.setState({
          networkType: connectionInfo.type,
        });
      }
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          networkType={this.state.networkType}
          refreshNetworkStatus={this._refreshNetworkStatus}
        />
      );
    }
  }
  hoistNonReactStatic(NetworkStatusComponent, WrappedComponent);

  return NetworkStatusComponent;
}
