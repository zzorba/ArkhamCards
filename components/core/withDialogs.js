import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import CountEditDialog from './CountEditDialog';
import TextEditDialog from './TextEditDialog';

export default function withDialogs(WrappedComponent) {
  class ComponentWithDialogs extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        baseViewRef: null,
        viewRef: null,
        textVisible: false,
        title: '',
        text: '',
        onTextChange: null,
        showCrossOut: false,
        countVisible: false,
        count: null,
        onCountChange: null,
      };

      this._captureViewRef = this.captureViewRef.bind(this);
      this._captureBaseViewRef = this.captureBaseViewRef.bind(this);
      this._showTextDialog = this.showTextDialog.bind(this);
      this._hideTextDialog = this.hideTextDialog.bind(this);
      this._showCountDialog = this.showCountDialog.bind(this);
      this._hideCountDialog = this.hideCountDialog.bind(this);
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

    showTextDialog(title, text, onTextChange, showCrossOut, numberOfLines) {
      this.setState({
        textVisible: true,
        title,
        text,
        onTextChange,
        numberOfLines: numberOfLines || 1,
        showCrossOut: !!showCrossOut,
      });
    }

    hideTextDialog() {
      this.setState({
        textVisible: false,
      });
    }

    renderTextDialog() {
      const {
        textVisible,
        title,
        text,
        onTextChange,
        baseViewRef,
        showCrossOut,
        numberOfLines,
      } = this.state;
      if (!baseViewRef) {
        return null;
      }
      return (
        <TextEditDialog
          visible={textVisible}
          viewRef={baseViewRef}
          title={title}
          text={text}
          onTextChange={onTextChange}
          toggleVisible={this._hideTextDialog}
          showCrossOut={showCrossOut}
          numberOfLines={numberOfLines}
        />
      );
    }

    showCountDialog(title, count, onCountChange) {
      this.setState({
        countVisible: true,
        title,
        count,
        onCountChange,
      });
    }

    hideCountDialog() {
      this.setState({
        countVisible: false,
      });
    }

    renderCountDialog() {
      const {
        countVisible,
        title,
        count,
        onCountChange,
        baseViewRef,
      } = this.state;
      if (!baseViewRef) {
        return null;
      }
      return (
        <CountEditDialog
          visible={countVisible}
          viewRef={baseViewRef}
          title={title}
          count={count}
          onCountChange={onCountChange}
          toggleVisible={this._hideCountDialog}
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
              showTextEditDialog={this._showTextDialog}
              showCountEditDialog={this._showCountDialog}
              {...this.props}
            />
          </View>
          { this.renderTextDialog() }
          { this.renderCountDialog() }
        </View>
      );
    }
  }

  return ComponentWithDialogs;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
