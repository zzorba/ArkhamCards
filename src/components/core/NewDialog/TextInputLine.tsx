import React, { Ref, useCallback, useContext } from 'react';
import { NativeSyntheticEvent, Platform, StyleSheet, Text, TextInput, TextInputSubmitEditingEventData, View } from 'react-native';

import StyleContext from '@styles/StyleContext';
import space, { s, xs } from '@styles/space';

interface Props {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;

  textInputRef: Ref<TextInput>;
  error?: string;

  onSubmit?: (text: string) => void;
}
export default function TextInputLine({ value, onChangeText, textInputRef, error, placeholder, onSubmit }: Props) {
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
          { padding: s, paddingTop: xs + s, width: '100%', borderRadius: 4, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.M, backgroundColor: colors.L20 },
          typography.text,
          error ? { borderColor: colors.warn } : undefined,
        ]}
        autoFocus={Platform.OS === 'ios'}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.lightText}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit ? onSubmitEditting : undefined}
        returnKeyType={onSubmit ? 'done' : undefined}
      />
      { !!error && (
        <View style={space.paddingTopS}>
          <Text style={[typography.text, typography.error]}>{ error } </Text>
        </View>
      ) }
    </>
  );
}