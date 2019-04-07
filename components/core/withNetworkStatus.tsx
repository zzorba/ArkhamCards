import React from 'react';
import NetInfo, { ConnectionInfo } from '@react-native-community/netinfo';
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

    _networkInterval?: number;
    constructor(props: P) {
      super(props);

      this.state = {};
    }

    componentDidMount() {
      this._refreshNetworkStatus();
      NetInfo.addEventListener('connectionChange', this._refreshNetworkStatus);
      this._networkInterval = setInterval(this._refreshNetworkStatus, 5000);
    }

    componentWillUnmount() {
      NetInfo.removeEventListener('connectionChange', this._refreshNetworkStatus);
      this._networkInterval && clearInterval(this._networkInterval);
    }

    _refreshNetworkStatus = () => {
      NetInfo.getConnectionInfo().then(this._networkStatusChanged);
    };

    _networkStatusChanged = (connectionInfo: ConnectionInfo) => {
      this.setState({
        networkType: connectionInfo.type,
      });
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
