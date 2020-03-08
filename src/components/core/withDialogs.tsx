import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';

import CountEditDialog from './CountEditDialog';
import TextEditDialog from './TextEditDialog';

export type ShowTextEditDialog = (
  title: string,
  text: string,
  onTextChange: (text: string) => void,
  showCrossOut?: boolean,
  numberOfLines?: number,
  onSaveAndAdd?: (text: string) => void,
) => void;

export type ShowCountEditDialog = (
  title: string,
  count: number,
  onCountChange: (count: number) => void,
) => void;

export interface InjectedDialogProps {
  captureViewRef: (viewRef: View) => void;
  viewRef?: View;
  showTextEditDialog: ShowTextEditDialog;
  showCountEditDialog: ShowCountEditDialog;
}

export default function withDialogs<P>(
  WrappedComponent: React.ComponentType<P & InjectedDialogProps>
) {
  interface State {
    baseViewRef?: View;
    viewRef?: View;
    textVisible: boolean;
    title: string;
    text: string;
    numberOfLines: number;
    onTextChange?: (text: string) => void;
    onSaveAndAdd?: (text: string) => void;
    showCrossOut: boolean;
    countVisible: boolean;
    count: number;
    onCountChange?: (count: number) => void;
  }

  class ComponentWithDialogs extends
    React.Component<P, State> {
    constructor(props: P) {
      super(props);

      this.state = {
        textVisible: false,
        title: '',
        text: '',
        numberOfLines: 2,
        showCrossOut: false,
        countVisible: false,
        count: 0,
      };
    }

    _captureBaseViewRef = (ref: View) => {
      this.setState({
        baseViewRef: ref,
      });
    };

    _captureViewRef = (ref: View) => {
      this.setState({
        viewRef: ref,
      });
    };

    _showTextDialog = (
      title: string,
      text: string,
      onTextChange: (text: string) => void,
      showCrossOut?: boolean,
      numberOfLines?: number,
      onSaveAndAdd?: (text: string) => void,
    ) => {
      this.setState({
        textVisible: true,
        title,
        text,
        onTextChange,
        onSaveAndAdd,
        numberOfLines: numberOfLines || 2,
        showCrossOut: !!showCrossOut,
      });
    };

    _hideTextDialog = () => {
      this.setState({
        textVisible: false,
      });
    };

    renderTextDialog() {
      const {
        textVisible,
        title,
        text,
        onTextChange,
        onSaveAndAdd,
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
          onSaveAndAdd={onSaveAndAdd}
          toggleVisible={this._hideTextDialog}
          showCrossOut={showCrossOut}
          numberOfLines={numberOfLines}
        />
      );
    }

    _showCountDialog = (
      title: string,
      count: number,
      onCountChange: (count: number) => void
    ) => {
      this.setState({
        countVisible: true,
        title,
        count,
        onCountChange,
      });
    };

    _hideCountDialog = () => {
      this.setState({
        countVisible: false,
      });
    };

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
              {...this.props}
              captureViewRef={this._captureViewRef}
              viewRef={this.state.viewRef}
              showTextEditDialog={this._showTextDialog}
              showCountEditDialog={this._showCountDialog}
            />
          </View>
          { this.renderTextDialog() }
          { this.renderCountDialog() }
        </View>
      );
    }
  }
  hoistNonReactStatic(ComponentWithDialogs, WrappedComponent);

  return ComponentWithDialogs;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
