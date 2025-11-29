import React, { useCallback, useContext, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { map, filter } from 'lodash';
import { t } from 'ttag';
import { useNavigation } from '@react-navigation/native';

import Card from '@data/types/Card';
import CardDetailSectionHeader from './CardDetailSectionHeader';
import StyleContext from '@styles/StyleContext';
import space, { m, s } from '@styles/space';
import { useAlternatePrintings } from './useAlternatePrintings';
import AppIcon from '@icons/AppIcon';
import COLORS from '@styles/colors';
import { showCard } from '@components/nav/helper';
import EncounterIcon from '@icons/EncounterIcon';
import InvestigatorImage from '@components/core/InvestigatorImage';

interface Props {
  card: Card;
}

interface AlternatePrintingRowProps {
  alternateCard: Card;
  isCurrentCard: boolean;
}

function AlternatePrintingRow({ alternateCard, isCurrentCard }: AlternatePrintingRowProps) {
  const navigation = useNavigation();
  const { typography, colors } = useContext(StyleContext);

  const onPress = useCallback(() => {
    if (!isCurrentCard) {
      showCard(navigation, alternateCard.id, alternateCard, colors, { showSpoilers: undefined })
    }
  }, [navigation, alternateCard, isCurrentCard, colors]);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isCurrentCard}
      style={[
        styles.row,
        space.paddingSideM,
        space.paddingTopS,
        space.paddingBottomS,
        { borderBottomWidth: 1, borderBottomColor: colors.L10 },
      ]}
    >
      <InvestigatorImage size="extra_tiny" card={alternateCard} />
      <View style={[space.paddingLeftS, styles.textContainer]}>
        <Text
          style={[
            typography.text,
            isCurrentCard && { color: colors.D20 },
          ]}
        >
          {alternateCard.pack_name}
        </Text>
        <Text style={[typography.small, { color: isCurrentCard ? colors.D20 : colors.D10 }]}>{' ('}</Text>
        <EncounterIcon encounter_code={alternateCard.cycle_code === 'parallel' ? 'parallel' : alternateCard.pack_code} size={20} color={colors.D20} />
        { alternateCard.position !== undefined && (
          <Text
            style={[
              typography.small,
              { color: isCurrentCard ? colors.D20 : colors.D10 },
              space.marginLeftXs,
            ]}
          >
            #{alternateCard.position}
          </Text>
        ) }
        <Text style={[typography.small, { color: isCurrentCard ? colors.D20 : colors.D10 }]}>{')'}</Text>
      </View>
      { isCurrentCard && (
        <View style={styles.currentBadge}>
          <Text style={[typography.small, { color: colors.D20 }]}>
            {t`Current`}
          </Text>
        </View>
      ) }
    </TouchableOpacity>
  );
}

export default function AlternatePrintingsComponent({ card }: Props) {
  const [alternateCards, loading] = useAlternatePrintings(card);

  // Filter out the current card from alternates
  const otherPrintings = useMemo(() => {
    return filter(alternateCards, alt => alt.code !== card.code);
  }, [alternateCards, card.code]);

  // Sort by pack position to show chronological order
  const sortedAlternates = useMemo(() => {
    return [...alternateCards].sort((a, b) => {
      // Put current card first
      if (a.code === card.code) {
        return -1;
      }
      if (b.code === card.code) {
        return 1;
      }
      // Then sort by pack position
      return (a.position || 0) - (b.position || 0);
    });
  }, [alternateCards, card.code]);

  if (loading || otherPrintings.length === 0) {
    return null;
  }
  return (
    <>
      <CardDetailSectionHeader title={t`Alternate Printings`} />
      <View style={styles.container}>
        { map(sortedAlternates, alternateCard =>
          alternateCard.code === card.code ? null : (
            <AlternatePrintingRow
              key={alternateCard.code}
              alternateCard={alternateCard}
              isCurrentCard={alternateCard.code === card.code}
            />
          )
        ) }
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textContainer: {
    marginLeft: 2,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentBadge: {
    paddingHorizontal: s,
    paddingVertical: 2,
  },
});
