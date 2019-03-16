import React from 'react';
import NetInfo from '@react-native-community/netinfo';
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
      this._networkInterval = setInterval(this._refreshNetworkStatus, 5000);
    }

    componentWillUnmount() {
      NetInfo.removeEventListener('connectionChange', this._networkStatusChanged);
      clearInterval(this._networkInterval);
    }

    refreshNetworkStatus() {
      NetInfo.isConnected.fetch().then(this._networkStatusChanged);
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
