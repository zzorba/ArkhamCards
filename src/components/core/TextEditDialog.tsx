import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  Platform,
  TextInput,
} from 'react-native';
import { startsWith } from 'lodash';
import { t } from 'ttag';

import DialogComponent from '@lib/react-native-dialog';
import Dialog from './Dialog';
import StyleContext from '@styles/StyleContext';
import { useWhyDidYouUpdate } from './hooks';

interface Props {
  title: string;
  visibleCount: number;
  text?: string;
  numberOfLines?: number;
  onAppend?: (text: string) => void;
  onUpdate?: (text: string) => void;
  showCrossOut: boolean;
}

export default function TextEditDialog(props: Props) {
  useWhyDidYouUpdate('TextEditDialog', props);
  const { title, visibleCount, text, numberOfLines = 1, onAppend, onUpdate, showCrossOut } = props;
  const { typography } = useContext(StyleContext);
  const textInputRef = useRef<TextInput>(null);
  const [height, setHeight] = useState(40);
  const updateSize = useCallback((event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
    const newHeight = event.nativeEvent.contentSize.height;
    if (newHeight > height) {
      setHeight(newHeight);
    }
  }, [setHeight, height]);
  const [originalText, setOriginalText] = useState(text || '');
  useEffect(() => {
    setOriginalText(text || '');
  }, [setOriginalText, text]);

  const [isCrossedOut, initialText] = useMemo(() => {
    const isCrossedOut = !!(showCrossOut && originalText) && startsWith(originalText, '~');
    setHeight(40);
    return [isCrossedOut, isCrossedOut ? originalText.substr(1) : originalText];
  }, [showCrossOut, originalText, setHeight]);

  const [editText, onTextChange] = useState(initialText);
  useEffect(() => {
    onTextChange(initialText);
  }, [initialText, onTextChange]);

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (visibleCount > 0) {
      setHeight(40);
      setVisible(true);
      // textInputRef.current && textInputRef.current.focus();
    }
  }, [visibleCount]);

  const onCancelPress = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onCrossOutPress = useCallback(() => {
    const result = isCrossedOut ? editText : `~${editText}`;
    onUpdate && onUpdate(result || '');
    setVisible(false);
  }, [onUpdate, setVisible, isCrossedOut, editText]);

  const onDonePress = useCallback(() => {
    const result = isCrossedOut ? `~${editText}` : editText;
    onUpdate && onUpdate(result || '');
    setVisible(false);
  }, [onUpdate, setVisible, isCrossedOut, editText]);

  const onSaveAndAddPress = useCallback(() => {
    const result = isCrossedOut ? `~${editText}` : editText;
    onAppend && onAppend(result || '');
    setOriginalText('');
    textInputRef.current && textInputRef.current.focus();
  }, [onAppend, editText, isCrossedOut, setOriginalText, textInputRef]);

  const textChanged = isCrossedOut ?
    editText !== originalText.substring(1) :
    editText !== originalText;
  const buttonColor = Platform.OS === 'ios' ? '#007ff9' : '#169689';
  // const height = 18 + Platform.select({ ios: 14, android: 22 }) * numberOfLines;
  return (
    <Dialog visible={visible} title={title}>
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
        textInputRef={textInputRef}
        wrapperStyle={{
          height: Math.min(height + 12, 200),
        }}
        value={editText}
        editable={!isCrossedOut}
        onChangeText={onTextChange}
        onSubmitEditing={onDonePress}
        multiline={numberOfLines > 1}
        numberOfLines={numberOfLines}
        onContentSizeChange={updateSize}
        returnKeyType="done"
        underlineColorAndroid="#888"
      />
      <DialogComponent.Button
        label={t`Cancel`}
        onPress={onCancelPress}
      />
      { !!showCrossOut && (
        <DialogComponent.Button
          label={isCrossedOut ? t`Uncross Out` : t`Cross Out`}
          color="#ff3b30"
          onPress={onCrossOutPress}
        />
      ) }
      { !!onAppend && (
        <DialogComponent.Button
          label={t`Add Another`}
          color={textChanged ? buttonColor : '#666666'}
          disabled={!textChanged}
          onPress={onSaveAndAddPress}
        />
      ) }
      { !isCrossedOut && (
        <DialogComponent.Button
          label={t`Done`}
          color={textChanged ? buttonColor : '#666666'}
          disabled={!textChanged}
          onPress={onDonePress}
        />
      ) }
    </Dialog>
  );
}
