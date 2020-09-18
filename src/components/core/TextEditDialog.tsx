import React from 'react';
import {
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  Platform,
  TextInput,
  View,
} from 'react-native';
import { startsWith, throttle } from 'lodash';
import { t } from 'ttag';

import DialogComponent from '@lib/react-native-dialog';
import Dialog from './Dialog';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

interface Props {
  title: string;
  visible: boolean;
  text?: string;
  numberOfLines?: number;
  viewRef?: View;
  onTextChange?: (text: string) => void;
  onSaveAndAdd?: (test: string) => void;
  toggleVisible: () => void;
  showCrossOut: boolean;
}

interface State {
  textInputRef?: TextInput;
  text?: string;
  originalText: string;
  isCrossedOut: boolean;
  submitting: boolean;
  height: number;
}
export default class TextEditDialog extends React.Component<Props, State> {
  static contextType = StyleContext;
  context!: StyleContextType;

  _textInputRef = React.createRef<TextInput>();
  _throttledUpdateSize!: (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      originalText: '',
      isCrossedOut: false,
      submitting: false,
      height: 40,
    };

    this._throttledUpdateSize = throttle(
      this._updateSize,
      200,
      { trailing: true }
    );
  }

  _updateSize = (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
    const height = event.nativeEvent.contentSize.height;
    if (height > this.state.height) {
      this.setState({
        height,
      });
    }
  };

  _onTextChange = (value: string) => {
    this.setState({
      text: value,
    });
  };

  componentDidUpdate(prevProps: Props) {
    const {
      visible,
      showCrossOut,
    } = this.props;
    if (visible && !prevProps.visible) {
      const text = this.props.text || '';
      const isCrossedOut = !!(showCrossOut && text) && startsWith(text, '~');
      /* eslint-disable react/no-did-update-set-state */
      this.setState({
        text: isCrossedOut ? text.substring(1) : text,
        originalText: text || '',
        height: 40,
        isCrossedOut,
      }, () => {
        if (this._textInputRef && this._textInputRef.current) {
          this._textInputRef.current.focus();
        }
      });
    }
  }

  _onCancelPress = () => {
    const {
      toggleVisible,
    } = this.props;
    toggleVisible();
  };

  _onCrossOutPress = () => {
    const {
      onTextChange,
      toggleVisible,
    } = this.props;
    const {
      isCrossedOut,
      text,
    } = this.state;
    const result = isCrossedOut ? text : `~${text}`;
    toggleVisible();
    onTextChange && onTextChange(result || '');
  }

  _onDonePress = () => {
    const {
      onTextChange,
      toggleVisible,
    } = this.props;
    const {
      text,
      isCrossedOut,
    } = this.state;
    const result = isCrossedOut ? `~${text}` : text;
    onTextChange && onTextChange(result || '');
    toggleVisible();
  };

  _onSaveAndAddPress = () => {
    const {
      onSaveAndAdd,
    } = this.props;
    const {
      text,
      isCrossedOut,
    } = this.state;
    const result = isCrossedOut ? `~${text}` : text;
    onSaveAndAdd && onSaveAndAdd(result || '');
    this.setState({
      text: '',
      originalText: '',
      height: 40,
      isCrossedOut: false,
    }, () => {
      if (this._textInputRef && this._textInputRef.current) {
        this._textInputRef.current.focus();
      }
    });
  };

  render() {
    const {
      visible,
      title,
      viewRef,
      showCrossOut,
      onSaveAndAdd,
      numberOfLines = 1,
    } = this.props;
    const {
      isCrossedOut,
      originalText,
      text,
      height,
    } = this.state;
    const { typography } = this.context;

    const textChanged = isCrossedOut ?
      text !== originalText.substring(1) :
      text !== originalText;
    const buttonColor = Platform.OS === 'ios' ? '#007ff9' : '#169689';
    // const height = 18 + Platform.select({ ios: 14, android: 22 }) * numberOfLines;
    return (
      <Dialog visible={visible} title={title} viewRef={viewRef}>
        { Platform.OS === 'android' && isCrossedOut && (
          <DialogComponent.Description style={typography.small}>
            { t`Note: This entry is crossed out` }
          </DialogComponent.Description>
        ) }
        <DialogComponent.Input
          style={[
            {
              height: Math.min(height + 12, 200),
            },
            isCrossedOut && Platform.OS === 'ios' ? {
              textDecorationLine: 'line-through',
              textDecorationStyle: 'solid',
              textDecorationColor: '#222',
            } : {},
          ]}
          wrapperStyle={{
            height: Math.min(height + 12, 200),
          }}
          textInputRef={this._textInputRef}
          value={text}
          editable={!isCrossedOut}
          onChangeText={this._onTextChange}
          onSubmitEditing={this._onDonePress}
          multiline={numberOfLines > 1}
          numberOfLines={numberOfLines}
          onContentSizeChange={this._updateSize}
          returnKeyType="done"
          underlineColorAndroid="#888"
        />
        <DialogComponent.Button
          label={t`Cancel`}
          onPress={this._onCancelPress}
        />
        { !!showCrossOut && (
          <DialogComponent.Button
            label={isCrossedOut ? t`Uncross Out` : t`Cross Out`}
            color="#ff3b30"
            onPress={this._onCrossOutPress}
          />
        ) }
        { !!onSaveAndAdd && (
          <DialogComponent.Button
            label={t`Add Another`}
            color={textChanged ? buttonColor : '#666666'}
            disabled={!textChanged}
            onPress={this._onSaveAndAddPress}
          />
        ) }
        { !isCrossedOut && (
          <DialogComponent.Button
            label={t`Done`}
            color={textChanged ? buttonColor : '#666666'}
            disabled={!textChanged}
            onPress={this._onDonePress}
          />
        ) }
      </Dialog>
    );
  }
}
