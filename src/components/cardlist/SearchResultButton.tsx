import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import AppIcon from '@icons/AppIcon';
import typography from '@styles/typography';
import COLORS from '@styles/colors';

interface Props {
  icon: 'search' | 'edit' | 'expand';
  title: string;
  onPress: () => void;
  fontScale: number;
}

export default class SearchResultButton extends React.Component<Props> {
  static Height(fontScale: number) {
    return (fontScale * 18) + 20 + 20;
  }

  renderIcon() {
    const { fontScale } = this.props;
    switch (this.props.icon) {
      case 'search':
        return <AppIcon name="search" size={18 * fontScale} color={COLORS.L20} />
      case 'edit':
        return <AppIcon name="edit" size={18 * fontScale} color={COLORS.L20} />
      case 'expand':
        return <AppIcon name="plus" size={18 * fontScale} color={COLORS.L20} />
    }
  }
  render() {
    const { title, onPress, fontScale } = this.props;
    const height = 18 * fontScale + 20;
    return (
      <View style={styles.wrapper}>
        <RectButton
          style={[
            styles.buttonStyle, {
              height,
              borderRadius: height / 2,
              paddingLeft: height / 4,
            },
          ]}
          underlayColor={COLORS.light20}
          rippleColor="#D7D3C6"
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
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    marginLeft: 12,
    marginRight: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonStyle: {
    backgroundColor: COLORS.M,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
});
