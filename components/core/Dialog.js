import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  StyleSheet,
  View,
  findNodeHandle,
} from 'react-native';
import DialogComponent from 'react-native-dialog';
import { BlurView } from 'react-native-blur';

export default class Dialog extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    viewRef: PropTypes.object,
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);

    this.state = {
      nodeHandle: props.viewRef && findNodeHandle(props.viewRef),
    };
  }

  componentDidUpdate(prevProps) {
    const {
      viewRef,
    } = this.props;
    if (viewRef !== prevProps.viewRef) {
      /* eslint-disable react/no-did-update-set-state */
      this.setState({
        nodeHandle: findNodeHandle(viewRef),
      });
    }
  }

  blurComponent() {
    const {
      nodeHandle,
    } = this.state;
    if (Platform.OS !== 'ios' || !nodeHandle) {
      return null;
    }

    return (
      <BlurView
        style={StyleSheet.absoluteFill}
        viewRef={nodeHandle}
        blurType="xlight"
        blurAmount={50}
      />
    );
  }

  render() {
    const {
      title,
      visible,
      children,
    } = this.props;
    return (
      <View>
        <DialogComponent.Container
          visible={visible}
          blurComponentIOS={this.blurComponent()}
        >
          <DialogComponent.Title>
            { title }
          </DialogComponent.Title>
          { children }
        </DialogComponent.Container>
      </View>
    );
  }
}
