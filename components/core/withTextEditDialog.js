import React from 'react';
import PropTypes from 'prop-types';
import { connectRealm } from 'react-native-realm';
import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';

import EditTextDialog from './EditTextDialog';

export default function withTextEditDialog(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        baseViewRef: null,
        viewRef: null,
        visible: false,
        title: '',
        text: '',
        onTextChange: null,
      };

      this._captureViewRef = this.captureViewRef.bind(this);
      this._captureBaseViewRef = this.captureBaseViewRef.bind(this);
      this._showDialog = this.showDialog.bind(this);
      this._hideDialog = this.hideDialog.bind(this);
    }

    captureBaseViewRef(ref) {
      this.setState({
        baseViewRef: ref,
      });
    }

    captureViewRef(ref) {
      this.setState({
        viewRef: ref,
      });
    }

    showDialog(title, text, onTextChange) {
      this.setState({
        visible: true,
        title,
        text,
        onTextChange,
      });
    }

    hideDialog() {
      this.setState({
        visible: false,
      });
    }

    renderDialog() {
      const {
        visible,
        title,
        text,
        onTextChange,
        baseViewRef
      } = this.state;
      if (!baseViewRef) {
        return null;
      }
      return (
        <EditTextDialog
          visible={visible}
          viewRef={baseViewRef}
          title={title}
          text={text}
          onTextChange={onTextChange}
          toggleVisible={this._hideDialog}
        />
      );
    }

    render() {
      return (
        <View style={styles.wrapper}>
          <View style={styles.wrapper} ref={this._captureBaseViewRef}>
            <WrappedComponent
              captureViewRef={this._captureViewRef}
              viewRef={this.state.viewRef}
              showTextEditDialog={this._showDialog}
              {...this.props}
            />
          </View>
          { this.renderDialog() }
        </View>
      );
    }
  };
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
