import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import AppIcon from '@icons/AppIcon';
import Card from '@data/Card';
import StyleContext from '@styles/StyleContext';
import typography from '@styles/typography';
import EncounterIcon from '@icons/EncounterIcon';

interface Props {
  card: Card;
}
export default function CardFooterInfo({ card }: Props) {
  const { colors, fontScale } = useContext(StyleContext);
  return (
    <View style={[styles.wrapper, { borderColor: colors.L10 }]}>
      <View style={styles.illustrator}>
        { !!card.illustrator && (
          <Text style={typography.cardSmall}>
            <AppIcon name="paintbrush" size={12 * fontScale} color={colors.D10} />
            { ` ${card.illustrator}` }
          </Text>
        ) }
      </View>
      <View style={styles.cardNumber}>
        { !!card.encounter_name && !!card.encounter_code && !!card.encounter_position && (
          <View style={styles.row}>
            <Text style={typography.cardSmall}>
              { card.encounter_name }&nbsp;
              <EncounterIcon
                encounter_code={card.encounter_code}
                size={11 * fontScale}
                color={colors.D10}
              />&nbsp;
            </Text>
            <Text style={typography.cardNumber}>
              { card.quantity && card.quantity > 1 ?
                `${card.encounter_position} - ${card.encounter_position + card.quantity}` :
                card.encounter_position }
            </Text>
          </View>
        ) }
        <View style={styles.row}>
          <Text style={typography.cardSmall}>
            { card.cycle_name }&nbsp;
            <EncounterIcon
              encounter_code={card.cycle_code || card.pack_code}
              size={11 * fontScale}
              color={colors.D10}
            />&nbsp;
          </Text>
          <Text style={typography.cardNumber}>
            { (card.position || 0) % 1000 }
          </Text>
        </View>

      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  wrapper: {
    marginTop: 16,
    width: '100%',
    paddingTop: 6,
    paddingBottom: 4,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  illustrator: {
    flexDirection: 'column',
  },
  cardNumber: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});