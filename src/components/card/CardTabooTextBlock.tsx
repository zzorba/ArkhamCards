import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import space, { isBig, s } from '@styles/space';
import ArkhamIcon from '@icons/ArkhamIcon';
import CardTextComponent from '@components/card/CardTextComponent';
import Card from '@data/types/Card';
import StyleContext from '@styles/StyleContext';

const SMALL_ICON_SIZE = isBig ? 26 : 16;

interface Props {
  card: Card;
}

export default function CardTabooTextBlock({ card }: Props) {
  const { fontScale, typography, colors } = useContext(StyleContext);
  if (!card.taboo_set_id || card.taboo_set_id === 0 || card.taboo_placeholder) {
    return null;
  }
  return (
    <View style={[styles.tabooTextBlock, { borderColor: colors.taboo }]}>
      <View style={styles.tabooRow}>
        <View style={space.marginRightXs}>
          <ArkhamIcon name="tablet" size={SMALL_ICON_SIZE * fontScale} color={colors.taboo} />
        </View>
        <Text style={typography.small}>
          { t`Taboo List` }
        </Text>
      </View>
      { !!card.extra_xp && (
        <>
          <Text style={typography.small}>
            { card.extra_xp > 0 ? t`Chained - ` : t`Unchained - `}
            { card.extra_xp > 0 ? t`Additional XP: ${card.extra_xp}.` : t`XP Discount: ${card.extra_xp}.` }
          </Text>
        </>
      ) }
      { (card.deck_limit === 0 && (!card.bonded_from && !card.bonded_name)) ? (
        <Text style={typography.small}>
          { t`Forbidden` }
        </Text>
      ) : !!card.taboo_text_change && (
        <>
          { !!card.taboo_original_text || !!card.taboo_original_back_text ? (
            <Text style={typography.small}>{t`Mutated`}</Text>
          ) : (
            <CardTextComponent text={card.taboo_text_change} />
          ) }
        </>
      ) }
    </View>
  );
}

const styles = StyleSheet.create({
  tabooRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  tabooTextBlock: {
    borderLeftWidth: 2,
    paddingLeft: s,
    marginBottom: s,
    marginRight: s,
  },
});
