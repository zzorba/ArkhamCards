import React from 'react';
import NetInfo, { ConnectionInfo } from '@react-native-community/netinfo';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { Subtract } from 'utility-types';

export interface InjectedNetworkStatusProps {
  networkType?: string;
  refreshNetworkStatus: () => void;
}

export default function withNetworkStatus<P extends InjectedNetworkStatusProps>(
  WrappedComponent: React.ComponentType<P>
) {
  interface State {
    networkType?: string;
  }
  class NetworkStatusComponent extends
    React.Component<Subtract<P, InjectedNetworkStatusProps>, State> {

    _networkInterval?: number;
    constructor(props: Subtract<P, InjectedNetworkStatusProps>) {
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
          {...this.props as P}
          networkType={this.state.networkType}
          refreshNetworkStatus={this._refreshNetworkStatus}
        />
      );
    }
  }
  hoistNonReactStatic(NetworkStatusComponent, WrappedComponent);

  return NetworkStatusComponent;
}
