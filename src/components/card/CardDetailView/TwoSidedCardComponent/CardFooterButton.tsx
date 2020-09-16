import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { t } from 'ttag';

import Card from '@data/Card';
import StyleContext from '@styles/StyleContext';
import { BorderlessButton, TouchableOpacity } from 'react-native-gesture-handler';
import typography from '@styles/typography';
import ArkhamIcon from '@icons/ArkhamIcon';

interface Props {
  icon: 'faq';
  title: string;
  onPress: () => void;
}

export default function CardFooterButton({ title, onPress }: Props) {
  const { colors, fontScale } = useContext(StyleContext);
  const height = 18 * fontScale + 20;
  return (
    <TouchableOpacity
      style={[
        styles.buttonStyle,
        {
          backgroundColor: colors.L10,
          height,
        },
      ]}

      onPress={onPress}
    >
      <View pointerEvents="box-none" style={styles.row}>
        <ArkhamIcon name="wild" size={18 * fontScale} color={colors.D20} />
        <Text style={[typography.cardButton, { marginLeft: height / 4, color: colors.D20 }]}>
          { title }
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    paddingLeft: 14,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  }
});
