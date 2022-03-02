import React, { useContext, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import space, { m, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { BorderColor } from '@data/scenario/types';
import ArkhamIcon from '@icons/ArkhamIcon';

interface Props {
  title: string;
  border_color?: BorderColor;
  center?: boolean;
  strikethrough?: boolean;
}
const DIVIDE_REGEX = new RegExp('^(.*)\\[(.*?)\\](.*)$');

function DivideText({ text, color }: { text: string; color: string }) {
  const match = text.match(DIVIDE_REGEX);
  if (match) {
    return (
      <>
        { match[1] }
        <ArkhamIcon name={match[2]} size={28} color={color} />
        { !!match[3] && <DivideText text={match[3]} color={color} /> }
      </>
    );
  }
  return <>{text}</>;
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
        <DivideText text={title} color={color} />
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  titleWrapper: {
    marginLeft: m,
    marginRight: m + s,
  },
  extraTopPadding: {
    paddingTop: m + s,
  },
});
