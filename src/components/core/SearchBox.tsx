import React from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import COLORS from 'styles/colors';

export const SEARCH_BAR_HEIGHT = 58;
interface Props {
  onChangeText: (search: string) => void;
  placeholder: string;
  value?: string;
  toggleAdvanced?: () => void;
  advancedOpen?: boolean;
}
export default class SearchBox extends React.Component<Props> {
  renderToggleButton() {
    const {
      toggleAdvanced,
      advancedOpen,
    } = this.props;
    if (!toggleAdvanced) {
      return null;
    }
    return (
      <TouchableOpacity style={styles.toggleButton} onPress={toggleAdvanced}>
        <View style={styles.icon}>
          <MaterialCommunityIcons
            name={advancedOpen ? 'chevron-double-up' : 'dots-horizontal'}
            size={32}
            color="#888"
          />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {
      placeholder,
      onChangeText,
      toggleAdvanced,
      value,
    } = this.props;

    return (
      <View style={[styles.container, !toggleAdvanced ? styles.underline : {}]}>
        <View style={styles.searchInputWrapper}>
          <TextInput
            style={styles.searchInput}
            clearButtonMode="always"
            autoCorrect={false}
            autoCapitalize="none"
            allowFontScaling={false}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={COLORS.lightText}
            value={value}
          />
          { this.renderToggleButton() }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  underline: {
    borderBottomWidth: 1,
    borderColor: COLORS.divider,
  },
  container: {
    backgroundColor: COLORS.background,
    width: '100%',
  },
  searchInputWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    height: SEARCH_BAR_HEIGHT,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontFamily: 'System',
    fontSize: 18,
    color: COLORS.darkText,
    backgroundColor: COLORS.veryVeryLightBackground,
    borderRadius: 10,
  },
  icon: {
    width: 32,
    height: 32,
  },
  toggleButton: {
    marginLeft: 8,
  },
});
