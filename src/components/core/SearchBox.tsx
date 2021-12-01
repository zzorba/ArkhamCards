import React, { forwardRef, useCallback, useContext, useImperativeHandle, useMemo, useRef } from 'react';
import {
  NativeSyntheticEvent,
  TextInput,
  Platform,
  StyleSheet,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import { t } from 'ttag';

import AppIcon from '@icons/AppIcon';
import ToggleButton from '@components/core/ToggleButton';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';

export const SEARCH_BAR_HEIGHT = 60;
export const SEARCH_BAR_INPUT_HEIGHT = SEARCH_BAR_HEIGHT - 20;

interface Props {
  onChangeText: (search: string, submit: boolean) => void;
  placeholder: string;
  value?: string;
  toggleAdvanced?: () => void;
  advancedOpen?: boolean;
}


export interface SearchBoxHandles {
  focus: () => void;
}

function SearchBox({ onChangeText, placeholder, value, toggleAdvanced, advancedOpen }: Props, ref: any) {
  const { colors } = useContext(StyleContext);
  const textInputRef = useRef<TextInput>(null);
  const clear = useCallback(() => {
    onChangeText('', true);
  }, [onChangeText]);

  const onSearchUpdated = useCallback((value: string) => {
    onChangeText(value, false);
  }, [onChangeText]);
  const onSubmit = useCallback((e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    onChangeText(e.nativeEvent.text, true);
  }, [onChangeText]);

  useImperativeHandle(ref, () => ({
    focus: () => {
      textInputRef.current?.focus();
    },
  }), [textInputRef]);

  const clearButton = useMemo(() => {
    if (!value) {
      return null;
    }
    return (
      <TouchableOpacity style={space.marginRightS} onPress={clear}>
        <View style={styles.dismissIcon}>
          <AppIcon name="dismiss" size={18} color={colors.D20} />
        </View>
      </TouchableOpacity>
    );
  }, [value, colors, clear]);

  const toggleButton = useMemo(() => {
    if (!toggleAdvanced) {
      return (
        <View style={styles.rightButtons}>
          { clearButton }
        </View>
      );
    }
    return (
      <View style={styles.rightButtons}>
        { clearButton }
        <ToggleButton accessibilityLabel={t`Search options`} value={!!advancedOpen} onPress={toggleAdvanced} icon="dots" />
      </View>
    );
  }, [toggleAdvanced, advancedOpen, clearButton]);

  return (
    <View style={[styles.container, { borderColor: colors.L10, backgroundColor: colors.L20 }, !toggleAdvanced ? styles.underline : undefined]}>
      <View style={[
        styles.searchInput,
        {
          backgroundColor: colors.L20,
          borderColor: colors.L10,
        },
      ]}>
        <View style={styles.searchIcon}>
          <AppIcon name="search" color={colors.M} size={18} />
        </View>
        <TextInput
          ref={textInputRef}
          clearButtonMode="never"
          autoCorrect={false}
          autoCapitalize="none"
          multiline={false}
          style={{
            marginTop: Platform.OS === 'ios' ? 6 : 0,
            fontFamily: 'Alegreya-Regular',
            fontSize: Platform.OS === 'android' ? 16 : 20,
            lineHeight: 24,
            flex: 1,
            color: colors.darkText,
            textAlignVertical: 'center',
          }}
          underlineColorAndroid="rgba(0,0,0,0)"
          allowFontScaling={false}
          onChangeText={onSearchUpdated}
          placeholder={placeholder}
          placeholderTextColor={colors.D20}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
          blurOnSubmit
          value={value}
        />
        <View style={{ marginRight: 1 }}>
          { toggleButton }
        </View>
      </View>
    </View>
  );
}


export default forwardRef(SearchBox);

const styles = StyleSheet.create({
  underline: {
    borderBottomWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
    marginLeft: 10,
  },
  container: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 10,
    paddingBottom: 10,
    width: '100%',
    height: SEARCH_BAR_HEIGHT,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: SEARCH_BAR_INPUT_HEIGHT / 2,
    height: SEARCH_BAR_INPUT_HEIGHT,
    borderWidth: 1,
    marginBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    position: 'relative',
  },
  rightButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: 8,
  },
  dismissIcon: {
    width: 24,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
