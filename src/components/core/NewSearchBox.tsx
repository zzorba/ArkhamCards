import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Input } from 'react-native-elements';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import AppIcon from '@icons/AppIcon';
import COLORS from '@styles/colors';

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
              size={28}
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

    return (
      <View style={[styles.container, !toggleAdvanced ? styles.underline : {}]}>
        <Input
          clearButtonMode="always"
          autoCorrect={false}
          autoCapitalize="none"
          inputContainerStyle={styles.searchInput}
          allowFontScaling={false}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.lightText}
          leftIcon={<AppIcon name="search" color={COLORS.M} size={18} />}
          rightIcon={this.renderToggleButton()}
          rightIconContainerStyle={{
            position: 'absolute',
            right: -2,
            top: -5 ,
          }}
          value={value}
        />
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
    backgroundColor: COLORS.L20,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 10,
    width: '100%',
    height: SEARCH_BAR_HEIGHT,
  },
  searchInput: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.L20,
    borderRadius: SEARCH_BAR_INPUT_HEIGHT / 2,
    height: SEARCH_BAR_INPUT_HEIGHT,
    borderWidth: 1,
    // borderColor: COLORS.L10,
    padding: 10,
    position: 'relative',
    fontFamily: 'System',
    fontSize: 18,
    color: COLORS.darkText,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButton: {
    marginLeft: 8,
  },
});
