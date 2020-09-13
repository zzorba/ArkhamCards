import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import typography from '@styles/typography';
import { isBig, xs, s } from '@styles/space';
import ArkhamIcon from '@icons/ArkhamIcon';
import CardTextComponent from '@components/card/CardTextComponent';
import Card from '@data/Card';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';

const SMALL_ICON_SIZE = isBig ? 26 : 16;

interface Props {
  card: Card;
}

export default function CardTabooTextBlock({ card }: Props) {
  if (!card.taboo_set_id || card.taboo_set_id === 0 || card.taboo_placeholder) {
    return null;
  }
  return (
    <StyleContext.Consumer>
      { ({ fontScale }) => (
        <View style={styles.tabooTextBlock}>
          <View style={styles.tabooRow}>
            <View style={styles.tabooIcon}>
              <ArkhamIcon name="tablet" size={SMALL_ICON_SIZE * fontScale} color={COLORS.taboo} />
            </View>
            <Text style={typography.cardText}>
              { t`Taboo List Changes` }
            </Text>
          </View>
          { !!card.extra_xp && (
            <Text style={typography.cardText}>
              { card.extra_xp > 0 ?
                t`Additional XP: ${card.extra_xp}.` :
                t`XP Discount: ${card.extra_xp}.` }
            </Text>
          ) }
          { !!card.taboo_text_change && (
            <CardTextComponent text={card.taboo_text_change} />
          ) }
        </View>
      ) }
    </StyleContext.Consumer>

  );
}

const styles = StyleSheet.create({
  tabooRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  tabooIcon: {
    marginRight: xs,
  },
  tabooTextBlock: {
    borderLeftWidth: 4,
    paddingLeft: s,
    marginBottom: s,
    marginRight: s,
    borderColor: COLORS.taboo,
  },
});
