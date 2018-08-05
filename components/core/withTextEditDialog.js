import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import EditTextDialog from './EditTextDialog';

export default function withTextEditDialog(WrappedComponent) {
  class TextEditDialogComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        baseViewRef: null,
        viewRef: null,
        visible: false,
        title: '',
        text: '',
        onTextChange: null,
        showCrossOut: false,
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

    showDialog(title, text, onTextChange, showCrossOut) {
      this.setState({
        visible: true,
        title,
        text,
        onTextChange,
        showCrossOut: !!showCrossOut,
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
        baseViewRef,
        showCrossOut,
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
          showCrossOut={showCrossOut}
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
  }

  return TextEditDialogComponent;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
