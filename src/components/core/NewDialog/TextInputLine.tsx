import React, { Ref, useCallback, useContext } from 'react';
import { NativeSyntheticEvent, Platform, ReturnKeyType, StyleSheet, Text, TextInput, TextInputSubmitEditingEventData, View } from 'react-native';

import StyleContext from '@styles/StyleContext';
import space, { s, xs } from '@styles/space';

interface Props {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;

  textInputRef?: Ref<TextInput>;
  error?: string;

  onSubmit?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  paddingBottom?: number;
  disabled?: boolean;

  returnKeyType?: ReturnKeyType;
  shrink?: boolean;
}
export default function TextInputLine({ shrink, value, onChangeText, returnKeyType, disabled, textInputRef, error, placeholder, paddingBottom, onSubmit, onFocus, onBlur }: Props) {
  const { colors, typography } = useContext(StyleContext);

  const onSubmitEditting = useCallback((e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    onSubmit && onSubmit(e.nativeEvent.text);
  }, [onSubmit]);

  return (
    <>
      <TextInput
        ref={textInputRef}
        autoCorrect={false}
        style={[
          { padding: s, paddingTop: xs + s, borderRadius: 4, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.M, backgroundColor: colors.L20, marginBottom: paddingBottom },
          shrink ? { flex: 1 } : { width: '100%' },
          typography.text,
          error ? { borderColor: colors.warn } : undefined,
        ]}
        autoFocus={Platform.OS === 'ios'}
        value={value}
        editable={!disabled}
        placeholder={placeholder}
        placeholderTextColor={colors.lightText}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        onSubmitEditing={onSubmit ? onSubmitEditting : undefined}
        returnKeyType={onSubmit ? 'done' : returnKeyType}
      />
      { !!error && (
        <View style={space.paddingTopS}>
          <Text style={[typography.text, typography.error]}>{ error } </Text>
        </View>
      ) }
    </>
  );
}