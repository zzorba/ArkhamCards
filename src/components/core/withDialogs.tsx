import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';

import TextEditDialog from './TextEditDialog';

export type ShowTextEditDialog = (
  title: string,
  text: string,
  onTextChange: (text: string) => void,
  showCrossOut?: boolean,
  numberOfLines?: number,
  onSaveAndAdd?: (text: string) => void,
) => void;

export interface InjectedDialogProps {
  captureViewRef: (viewRef: View) => void;
  viewRef?: View;
  showTextEditDialog: ShowTextEditDialog;
}

export default function withDialogs<P>(
  WrappedComponent: React.ComponentType<P & InjectedDialogProps>
) {
  interface State {
    baseViewRef?: View;
    viewRef?: View;
    textVisibleCount: number;
    title: string;
    text: string;
    numberOfLines: number;
    onTextChange?: (text: string) => void;
    onSaveAndAdd?: (text: string) => void;
    showCrossOut: boolean;
  }

  class ComponentWithDialogs extends
    React.Component<P, State> {
    constructor(props: P) {
      super(props);

      this.state = {
        textVisibleCount: 0,
        title: '',
        text: '',
        numberOfLines: 2,
        showCrossOut: false,
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
      console.log('showTextDialog', { title, text, onTextChange });
      this.setState({
        textVisibleCount: this.state.textVisibleCount + 1,
        title,
        text,
        onTextChange,
        onSaveAndAdd,
        numberOfLines: numberOfLines || 2,
        showCrossOut: !!showCrossOut,
      });
    };

    renderTextDialog() {
      const {
        textVisibleCount,
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
          visibleCount={textVisibleCount}
          title={title}
          text={text}
          onUpdate={onTextChange}
          onAppend={onSaveAndAdd}
          showCrossOut={showCrossOut}
          numberOfLines={numberOfLines}
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
            />
          </View>
          { this.renderTextDialog() }
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
