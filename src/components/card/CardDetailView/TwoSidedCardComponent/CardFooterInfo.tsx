import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { flatMap } from 'lodash';

import AppIcon from '@icons/AppIcon';
import Card from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import EncounterIcon from '@icons/EncounterIcon';
import { TINY_PHONE } from '@styles/sizes';
import space from '@styles/space';

interface Props {
  card: Card;
}
export default function CardFooterInfo({ card }: Props) {
  const { colors, fontScale, typography } = useContext(StyleContext);
  const quantity = card.quantity || 0;
  return (
    <View style={[styles.wrapper, { borderColor: colors.L10 }, TINY_PHONE ? { flexDirection: 'column', alignItems: 'flex-end' } : {}]}>
      <View style={styles.left}>
        <View style={styles.illustrator}>
          { !!card.illustrator && (
            <>
              <AppIcon name="paintbrush" size={14 * fontScale} color={colors.D20} />
              <Text style={typography.tiny} ellipsizeMode="tail" numberOfLines={1}>
                { ` ${card.illustrator}` }
              </Text>
            </>
          ) }
        </View>
      </View>
      <View style={[styles.cardNumber, { flex: 1 }]}>
        { (!!card.encounter_name && !!card.encounter_code && !!card.encounter_position) && (
          <View style={[styles.row, styles.encounterRow]}>
            <Text style={typography.tiny}>
              { card.encounter_name }
            </Text>
            <View style={styles.icon}>
              <EncounterIcon
                encounter_code={card.encounter_code}
                size={14 * fontScale}
                color={colors.darkText}
              />
            </View>
            <Text style={typography.tiny}>
              { card.quantity && card.quantity > 1 ?
                `${card.encounter_position} - ${card.encounter_position + card.quantity - 1}` :
                card.encounter_position } / {card.encounter_size || 0}
            </Text>
          </View>
        )}
        <View style={styles.column}>
          { !!card.reprint_info?.length && flatMap(card.reprint_info, (info, idx) => {
            return (!!info.pack_name && !!info.pack_code && !!info.position) && (
              <View style={[styles.row]} key={idx}>
                { !!info.cycle_name && (
                  <Text
                    style={[typography.tiny, typography.right, { flex: 1 }]}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  >
                    { info.pack_name }
                  </Text>
                ) }
                { !!info.pack_code && (
                  <View style={styles.icon}>
                    <EncounterIcon
                      encounter_code={info.pack_code}
                      size={14 * fontScale}
                      color={colors.darkText}
                    />
                  </View>
                ) }
                { !!info.position && (
                  <Text style={typography.tiny}>
                    { (info.position || 0) % 1000 }
                  </Text>
                ) }
                { !card.encounter_code && card.type_code !== 'investigator' && !!info.quantity && (
                  <View style={[styles.row, styles.encounterRow, space.marginLeftXs]}>
                    <AppIcon name="card-outline" size={14 * fontScale} color={colors.D20} />
                    <Text style={typography.small}>
                      ×{info.quantity}
                    </Text>
                  </View>
                ) }
              </View>
            );
          })}
          <View style={styles.row}>
            <Text
              style={[typography.tiny, typography.right, { flex: 1 }]}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              { card.cycle_name }
            </Text>
            <View style={styles.icon}>
              <EncounterIcon
                encounter_code={card.custom() ? card.pack_code : (card.cycle_code || card.pack_code)}
                size={14 * fontScale}
                color={colors.darkText}
              />
            </View>
            <Text style={typography.tiny}>
              { (card.position || 0) % 1000 }
            </Text>
            { !card.encounter_code && card.type_code !== 'investigator' && (
              <View style={[styles.row, styles.encounterRow, space.marginLeftXs]}>
                <AppIcon name="card-outline" size={14 * fontScale} color={colors.D20} />
                <Text style={typography.small}>
                  ×{quantity}
                </Text>
              </View>
            ) }
          </View>
        </View>
        {
          // tslint:disable-next-line
          !card.encounter_name && card.pack_name !== card.cycle_name && card.cycle_code !== 'core' && (
            <View style={[styles.row, styles.encounterRow]}>
              <Text style={typography.tiny} ellipsizeMode="tail" numberOfLines={2}>
                { card.pack_name }
              </Text>
            </View>
          )
        }
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  wrapper: {
    marginTop: 16,
    width: '100%',
    paddingTop: 6,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  left: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  illustrator: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 2,
  },
  cardNumber: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  column: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  encounterRow: {
    marginBottom: 4,
  },
  icon: {
    marginLeft: 2,
    marginRight: 2,
  },
});