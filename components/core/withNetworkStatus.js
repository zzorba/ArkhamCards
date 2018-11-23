import React from 'react';
import {
  NetInfo,
} from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';

export default function withNetworkStatus(WrappedComponent) {
  class NetworkStatusComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        networkType: null,
      };

      this._networkStatusChanged = this.networkStatusChanged.bind(this);
      this._refreshNetworkStatus = this.refreshNetworkStatus.bind(this);
    }

    componentDidMount() {
      this.refreshNetworkStatus();
      NetInfo.addEventListener('connectionChange', this._networkStatusChanged);
    }

    componentWillUnmount() {
      NetInfo.removeEventListener('connectionChange', this._networkStatusChanged);
    }

    refreshNetworkStatus() {
      NetInfo.getConnectionInfo().then(this._networkStatusChanged);
    }

    networkStatusChanged(connectionInfo) {
      this.setState({
        networkType: connectionInfo.type,
      });
    }

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
