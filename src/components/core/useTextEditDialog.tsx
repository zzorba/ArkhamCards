import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  TextInput,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import { t } from 'ttag';
import { startsWith, reverse } from 'lodash';

import NewDialog from '@components/core/NewDialog';
import DeckButton from '@components/deck/controls/DeckButton';
import space, { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';

export type ShowTextEditDialog = (
  title: string,
  text: string,
  onTextChange: (text: string) => void,
  showCrossOut?: boolean,
  numberOfLines?: number,
  onSaveAndAdd?: (text: string) => void,
) => void;

interface ActiveState {
  title: string;
  text: string;
  onTextChange?: (text: string) => void;
  showCrossOut: boolean;
  numberOfLines: number;
  onSaveAndAdd?: (text: string) => void;
}

function useAdvancedTextEditDialog({
  title,
  text,
  numberOfLines,
  onAppend,
  onUpdate,
  showCrossOut,
}: {
  title: string;
  text?: string;
  numberOfLines: number;
  onAppend?: (text: string) => void;
  onUpdate?: (text: string) => void;
  showCrossOut: boolean;
}): {
  dialog: React.ReactNode;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  showDialog: () => void;
} {
  const { colors, typography } = useContext(StyleContext);
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
  const [visible, setVisible] = useState(false);

  const [isCrossedOut, initialText] = useMemo(() => {
    const isCrossedOut = !!(showCrossOut && originalText) && startsWith(originalText, '~');
    setHeight(40);
    return [isCrossedOut, isCrossedOut ? originalText.substring(1) : originalText];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCrossOut, originalText, setHeight, visible]);

  const [editText, onTextChange] = useState(initialText);
  useEffect(() => {
    onTextChange(initialText);
  }, [initialText, onTextChange, visible]);
  useEffect(() => {
    if (visible) {
      setHeight(40);
      if (Platform.OS === 'android') {
        setTimeout(() => textInputRef.current?.focus(), 100);
      }
    }
  }, [visible]);


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
    onTextChange('');
    textInputRef.current && textInputRef.current.focus();
  }, [onAppend, editText, isCrossedOut, setOriginalText, onTextChange, textInputRef]);

  const textChanged = isCrossedOut ?
    editText !== originalText.substring(1) :
    editText !== originalText;

  const buttons = useMemo(() => {
    const result: React.ReactNode[] = [];
    if (showCrossOut) {
      result.push(
        <DeckButton
          key="cross-out"
          icon={isCrossedOut ? 'plus-button' : 'minus-button'}
          title={isCrossedOut ? t`Uncross Out` : t`Cross Out`}
          thin
          onPress={onCrossOutPress}
        />
      );
    }
    if (onAppend) {
      result.push(
        <DeckButton
          key="save-and-add"
          icon="plus-button"
          title={t`Add Another`}
          thin
          disabled={!textChanged}
          onPress={onSaveAndAddPress}
        />
      );
    }
    if (!isCrossedOut) {
      result.push(
        <DeckButton
          key="done"
          icon="check-thin"
          title={t`Done`}
          thin
          disabled={!textChanged}
          onPress={onDonePress}
        />
      );
    }
    result.push(
      <DeckButton
        key="cancel"
        icon="dismiss"
        color="red_outline"
        title={t`Cancel`}
        thin
        onPress={onCancelPress}
      />
    );
    if (result.length <= 2) {
      return reverse(result);
    }
    return result;
  }, [onDonePress, onSaveAndAddPress, onCancelPress, onCrossOutPress, onAppend, isCrossedOut, textChanged, showCrossOut]);
  const dialog = useMemo(() => {
    return (
      <NewDialog
        title={title}
        dismissable
        onDismiss={onCancelPress}
        visible={visible}
        buttons={buttons}
        alignment="bottom"
        avoidKeyboard
      >
        <View style={space.paddingSideS}>
          { Platform.OS === 'android' && isCrossedOut && (
            <View style={space.paddingBottomS}>
              <Text style={typography.small}>
                { t`Note: This entry is crossed out` }
              </Text>
            </View>
          ) }
          <TextInput
            ref={textInputRef}
            autoCorrect={false}
            style={[
              {
                height: Math.min(height + s * 2 + xs, 200),
                padding: s,
                paddingTop: xs + s,
                width: '100%',
                borderRadius: 4,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: colors.M,
                backgroundColor:
                colors.L20,
              },
              typography.text,
            ]}
            autoFocus={Platform.OS === 'ios'}
            value={editText}
            multiline={numberOfLines > 1}
            editable={!isCrossedOut}
            onChangeText={onTextChange}
            onSubmitEditing={onDonePress}
            onContentSizeChange={updateSize}
            returnKeyType="done"
            underlineColorAndroid="#888"
          />
        </View>
      </NewDialog>
    );
  }, [title, onCancelPress, colors, editText, numberOfLines, onTextChange, updateSize, height, isCrossedOut, onDonePress, typography, visible, buttons]);
  const showDialog = useCallback(() => setVisible(true), [setVisible]);
  return {
    visible,
    setVisible,
    dialog,
    showDialog,
  };
}

export default function useTextEditDialog(): [React.ReactNode, ShowTextEditDialog] {
  const [activeState, setActiveState] = useState<ActiveState | undefined>(undefined);
  const onTextChange = useCallback((text: string) => {
    if (activeState?.onTextChange) {
      activeState.onTextChange(text);
    }
  }, [activeState]);

  const { dialog, showDialog } = useAdvancedTextEditDialog({
    title: activeState?.title || '',
    text: activeState?.text || '',
    numberOfLines: activeState?.numberOfLines || 1,
    showCrossOut: !!activeState?.showCrossOut,
    onUpdate: onTextChange,
    onAppend: activeState?.onSaveAndAdd,
  });

  const showTextEditDialog = useCallback((
    title: string,
    text: string,
    onTextChange: (text: string) => void,
    showCrossOut?: boolean,
    numberOfLines?: number,
    onSaveAndAdd?: (text: string) => void,
  ) => {
    setActiveState({
      title,
      text,
      onTextChange,
      showCrossOut: !!showCrossOut,
      numberOfLines: numberOfLines || 2,
      onSaveAndAdd,
    });
    showDialog();
  }, [setActiveState, showDialog]);
  return [dialog, showTextEditDialog];
}
