import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Input } from 'react-native-elements';
import { t } from 'ttag';

import AppIcon from '@icons/AppIcon';
import COLORS from '@styles/colors';
import ToggleButton from '@components/core/ToggleButton';
import StyleContext, { StyleContextType } from '@styles/StyleContext';
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

export default class SearchBox extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  _clear = () => {
    this.props.onChangeText('');
  };

  renderClearButton(rightPadding?: boolean) {
    const { value } = this.props;
    if (!value) {
      return undefined;
    }
    return (
      <TouchableOpacity style={rightPadding ? space.marginRightS : undefined} onPress={this._clear}>
        <View style={styles.dismissIcon}>
          <AppIcon name="dismiss" size={18} color={COLORS.D20} />
        </View>
      </TouchableOpacity>
    );
  }
  renderToggleButton() {
    const {
      toggleAdvanced,
      advancedOpen,
    } = this.props;
    const { colors } = this.context;
    if (!toggleAdvanced) {
      return (
        <View style={styles.rightButtons}>
          { this.renderClearButton() }
        </View>
      );
    }
    return (
      <View style={styles.rightButtons}>
        { this.renderClearButton(true) }
        <ToggleButton accessibilityLabel={t`Search options`} value={!!advancedOpen} onPress={toggleAdvanced} icon="dots" />
      </View>
    );
  }

  render() {
    const {
      placeholder,
      onChangeText,
      toggleAdvanced,
      value,
    } = this.props;
    const { colors, borderStyle } = this.context;

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
          fontSize: 20,
          lineHeight: 24,
          color: colors.darkText,
          textAlignVertical: 'center',
        }}
        underlineColorAndroid="rgba(0,0,0,0)"
        allowFontScaling={false}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.D20}
        leftIcon={<View style={styles.searchIcon}><AppIcon name="search" color={COLORS.M} size={18} /></View>}
        rightIcon={this.renderToggleButton()}
        rightIconContainerStyle={{
          marginRight: -13,
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
  },
  rightButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: 8,
  },
  closeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissIcon: {
    width: 24,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
