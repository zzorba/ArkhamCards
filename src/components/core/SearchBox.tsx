import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Input } from 'react-native-elements';

import AppIcon from '@icons/AppIcon';
import COLORS from '@styles/colors';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

export const SEARCH_BAR_HEIGHT = 60;
export const SEARCH_BAR_INPUT_HEIGHT = SEARCH_BAR_HEIGHT - 20;
interface Props {
  onChangeText: (search: string) => void;
  placeholder: string;
  value?: string;
  toggleAdvanced?: () => void;
  advancedOpen?: boolean;
}

export default class SearchBox extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  renderToggleButton() {
    const {
      toggleAdvanced,
      advancedOpen,
    } = this.props;
    if (!toggleAdvanced) {
      return undefined;
    }
    return (
      <TouchableOpacity style={styles.toggleButton} onPress={toggleAdvanced}>
        { advancedOpen ? (
          <View style={[styles.icon, { backgroundColor: COLORS.D10 }] }>
            <AppIcon
              name="dismiss"
              size={22}
              color={COLORS.L10}
            />
          </View>
        ) : (
          <View style={[styles.icon, { backgroundColor: COLORS.L10 }] }>
            <AppIcon
              name="dots"
              size={24}
              color={COLORS.D10}
            />
          </View>
        ) }
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
    const { colors } = this.context;

    return (
      <Input
        clearButtonMode="always"
        autoCorrect={false}
        autoCapitalize="none"
        containerStyle={[styles.container, { backgroundColor: colors.L20, borderColor: colors.divider }, !toggleAdvanced ? styles.underline : {}]}
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
          fontSize: 20,
          lineHeight: 24,
          color: colors.darkText,
          textAlignVertical: 'center',
        }}
        allowFontScaling={false}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.D20}
        leftIcon={<View style={styles.searchIcon}><AppIcon name="search" color={COLORS.M} size={18} /></View>}
        rightIcon={this.renderToggleButton()}
        rightIconContainerStyle={{
          position: 'absolute',
          right: -3,
          top: -5 ,
        }}
        value={value}
      />
    );
  }
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
    fontFamily: 'System',
    fontSize: 18,
    lineHeight: 22,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButton: {
    marginLeft: 8,
  },
});
