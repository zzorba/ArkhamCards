import React, { useCallback, useContext, useMemo } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Input } from 'react-native-elements';
import { t } from 'ttag';

import AppIcon from '@icons/AppIcon';
import ToggleButton from '@components/core/ToggleButton';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';

export const SEARCH_BAR_HEIGHT = 60;
export const SEARCH_BAR_INPUT_HEIGHT = SEARCH_BAR_HEIGHT - 20;

interface Props {
  onChangeText: (search: string) => void;
  placeholder: string;
  value?: string;
  toggleAdvanced?: () => void;
  advancedOpen?: boolean;
}

export default function SearchBox({ onChangeText, placeholder, value, toggleAdvanced, advancedOpen }: Props) {
  const { borderStyle, colors } = useContext(StyleContext);
  const clear = useCallback(() => {
    onChangeText('');
  }, [onChangeText]);

  const renderClearButton = useCallback((rightPadding?: boolean) => {
    if (!value) {
      return null;
    }
    return (
      <TouchableOpacity style={rightPadding ? space.marginRightS : undefined} onPress={clear}>
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
          { renderClearButton() }
        </View>
      );
    }
    return (
      <View style={styles.rightButtons}>
        { renderClearButton(true) }
        <ToggleButton accessibilityLabel={t`Search options`} value={!!advancedOpen} onPress={toggleAdvanced} icon="dots" />
      </View>
    );
  }, [toggleAdvanced, advancedOpen, renderClearButton]);

  return (
    <Input
      clearButtonMode="never"
      autoCorrect={false}
      autoCapitalize="none"
      multiline={false}
      containerStyle={[styles.container, borderStyle, { backgroundColor: colors.L20 }, !toggleAdvanced ? styles.underline : {}]}
      inputContainerStyle={[
        styles.searchInput,
        {
          backgroundColor: colors.L20,
          borderColor: colors.L10,
        },
      ]}
      inputStyle={{
        marginTop: 6,
        fontFamily: 'Alegreya-Regular',
        fontSize: Platform.OS === 'android' ? 16 : 20,
        lineHeight: 24,
        color: colors.darkText,
        textAlignVertical: 'center',
      }}
      underlineColorAndroid="rgba(0,0,0,0)"
      allowFontScaling={false}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.D20}
      leftIcon={<View style={styles.searchIcon}><AppIcon name="search" color={colors.M} size={18} /></View>}
      rightIcon={toggleButton}
      rightIconContainerStyle={{
        marginRight: -13,
      }}
      value={value}
    />
  );
}

const styles = StyleSheet.create({
  underline: {
    borderBottomWidth: 1,
  },
  searchIcon: {
    marginRight: 4,
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
    justifyContent: 'flex-start',
    borderRadius: SEARCH_BAR_INPUT_HEIGHT / 2,
    height: SEARCH_BAR_INPUT_HEIGHT,
    borderWidth: 1,
    marginBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    padding: 10,
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
