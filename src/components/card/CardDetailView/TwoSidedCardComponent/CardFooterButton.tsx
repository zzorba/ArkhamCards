import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { t } from 'ttag';

import Ripple from '@lib/react-native-material-ripple';
import StyleContext from '@styles/StyleContext';
import ArkhamIcon from '@icons/ArkhamIcon';
import AppIcon from '@icons/AppIcon';
import RoundedFooterButton from '@components/core/RoundedFooterButton';
import RoundedFooterDoubleButton from '@components/core/RoundedFooterDoubleButton';

interface Props {
  onPressFaq: () => void;
  onPressTaboo?: () => void;
}

export default function CardFooterButton({ onPressFaq, onPressTaboo }: Props) {
  const { colors, fontScale, typography } = useContext(StyleContext);
  const height = 18 * fontScale + 20;
  if (onPressTaboo) {
    return (
      <RoundedFooterDoubleButton
        onPressA={onPressFaq}
        iconA="faq"
        titleA={t`FAQ`}
        onPressB={onPressTaboo}
        iconB="taboo"
        titleB={t`Taboo`}
      />
    );
  }
  return (
    <RoundedFooterButton
      onPress={onPressFaq}
      title={t`FAQ`}
      icon="faq"
    />
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
  },
  divider: {
    width: 1,
  },
});
