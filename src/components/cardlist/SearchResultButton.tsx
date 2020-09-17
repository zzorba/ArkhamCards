import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import AppIcon from '@icons/AppIcon';
import typography from '@styles/typography';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

interface Props {
  icon: 'search' | 'edit' | 'expand';
  title: string;
  onPress: () => void;
}

export default class SearchResultButton extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  static Height(fontScale: number) {
    return (fontScale * 18) + 20 + 20;
  }

  renderIcon() {
    const { colors, fontScale } = this.context;
    switch (this.props.icon) {
      case 'search':
        return <AppIcon name="search" size={18 * fontScale} color={colors.L20} />;
      case 'edit':
        return <View style={styles.editIcon}><AppIcon name="edit" size={16 * fontScale} color={colors.L20} /></View>;
      case 'expand':
        return <AppIcon name="plus" size={18 * fontScale} color={colors.L20} />;
    }
  }

  render() {
    const { title, onPress } = this.props;
    const { colors, backgroundStyle, fontScale } = this.context;
    const height = 18 * fontScale + 20;
    return (
      <View style={[styles.wrapper, backgroundStyle]}>
        <RectButton
          style={[
            styles.buttonStyle, {
              backgroundColor: colors.M,
              height,
              borderRadius: height / 2,
              paddingLeft: height / 4,
            },
          ]}
          underlayColor={colors.L20}
          rippleColor={colors.L10}
          onPress={onPress}
        >
          <View pointerEvents="box-none" style={styles.row}>
            { this.renderIcon() }
            <Text style={[typography.cardButton, { marginLeft: height / 4 }]}>
              { title }
            </Text>
          </View>
        </RectButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 10,
    paddingBottom: 10,
  },
  buttonStyle: {
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  editIcon: {
    marginLeft: 2,
  },
});
