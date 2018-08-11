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
    }

    componentDidMount() {
      NetInfo.getConnectionInfo().then(this._networkStatusChanged);
      NetInfo.addEventListener('connectionChange', this._networkStatusChanged);
    }

    componentWillUnmount() {
      NetInfo.removeEventListener('connectionChange', this._networkStatusChanged);
    }

    networkStatusChanged(connectionInfo) {
      this.setState({
        networkType: connectionInfo.type,
      });
    }

    render() {
      return (
        <WrappedComponent networkType={this.state.networkType} {...this.props} />
      );
    }
  }
  hoistNonReactStatic(NetworkStatusComponent, WrappedComponent);

  return NetworkStatusComponent;
}
