import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import space, { m, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { BorderColor } from '@data/scenario/types';
import TextWithIcons from '@components/core/TextWithIcons';

interface Props {
  title: string;
  border_color?: BorderColor;
  center?: boolean;
  strikethrough?: boolean;
}
export default function TitleComponent({ title, center, strikethrough, border_color = 'setup' }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const color = colors.campaign.text[border_color];
  return (
    <View style={styles.titleWrapper}>
      <Text style={[
        typography.bigGameFont,
        { color },
        space.paddingTopL,
        center ? typography.center : {},
        strikethrough ? { textDecorationLine: 'line-through' } : undefined,
      ]}>
        <TextWithIcons size={28} text={title} color={color} />
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  titleWrapper: {
    marginLeft: m,
    marginRight: m + s,
  },
});
