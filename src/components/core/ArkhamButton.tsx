import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import Ripple from '@lib/react-native-material-ripple';
import AppIcon from '@icons/AppIcon';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

export type ArkhamButtonIcon = 'search' | 'edit' | 'expand' | 'deck' | 'card' | 'up' | 'campaign';
interface Props {
  icon: ArkhamButtonIcon;
  title: string;
  onPress: () => void;
}

export default class ArkhamButton extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  static Height(fontScale: number) {
    return (fontScale * 18) + 20 + 20;
  }

  renderIcon() {
    const { colors, fontScale } = this.context;
    switch (this.props.icon) {
      case 'card':
        return <View style={styles.cardIcon}><AppIcon name="cards" size={22 * fontScale} color={colors.L20} /></View>;
      case 'deck':
        return <View style={styles.deckIcon}><AppIcon name="deck" size={24 * fontScale} color={colors.L20} /></View>;
      case 'search':
        return <AppIcon name="search" size={18 * fontScale} color={colors.L20} />;
      case 'campaign':
        return <AppIcon name="book" size={18 * fontScale} color={colors.L20} />;
      case 'edit':
        return <View style={styles.editIcon}><AppIcon name="edit" size={16 * fontScale} color={colors.L20} /></View>;
      case 'expand':
        return <AppIcon name="plus" size={18 * fontScale} color={colors.L20} />;
      case 'up':
        return <View style={styles.upIcon}><MaterialCommunityIcons name="arrow-up-bold" size={22 * fontScale} color={colors.L20} /></View>;
    }
  }

  render() {
    const { title, onPress } = this.props;
    const { colors, backgroundStyle, fontScale, typography } = this.context;
    const height = 18 * fontScale + 20;
    return (
      <View style={[styles.wrapper, backgroundStyle]}>
        <Ripple
          style={[
            styles.buttonStyle, {
              backgroundColor: colors.M,
              height,
              borderRadius: height / 2,
              paddingLeft: height / 4,
            },
          ]}
          rippleColor={colors.L10}
          onPress={onPress}
        >
          <View pointerEvents="box-none" style={styles.row}>
            { this.renderIcon() }
            <Text style={[typography.button, { marginLeft: height / 4 }]}>
              { title }
            </Text>
          </View>
        </Ripple>
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
  deckIcon: {
    marginTop: -4,
  },
  cardIcon: {
    marginTop: -2,
    marginRight: -4,
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
  upIcon: {
    marginTop: -2,
  },
});
