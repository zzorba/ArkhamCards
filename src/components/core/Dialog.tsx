import React, { ReactNode } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  findNodeHandle,
} from 'react-native';
import DialogComponent from 'react-native-dialog';
import { BlurView } from 'react-native-blur';

interface Props {
  title: string;
  visible: boolean;
  viewRef?: View;
  children?: ReactNode;
}

interface State {
  nodeHandle: null | number;
}

export default class Dialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      nodeHandle: props.viewRef ? findNodeHandle(props.viewRef) : null,
    };
  }

  componentDidUpdate(prevProps: Props) {
    const {
      viewRef,
    } = this.props;
    if (viewRef !== prevProps.viewRef) {
      /* eslint-disable react/no-did-update-set-state */
      this.setState({
        nodeHandle: viewRef ? findNodeHandle(viewRef) : null,
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
        style={styles.blur}
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

const styles = StyleSheet.create({
  blur: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
