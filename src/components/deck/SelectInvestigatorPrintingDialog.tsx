import React, { useCallback, useContext, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { filter, map } from 'lodash';
import { t } from 'ttag';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { RootStackParamList } from '@navigation/types';
import Card from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import space, { s } from '@styles/space';
import { useAlternatePrintings } from '@components/card/CardDetailView/useAlternatePrintings';
import EncounterIcon from '@icons/EncounterIcon';
import { TouchableOpacity } from '@components/core/Touchables';
import { CampaignId, Deck } from '@actions/types';
import useSingleCard from '@components/card/useSingleCard';

export interface SelectInvestigatorPrintingProps {
  investigatorCode: string;
  campaignId?: CampaignId;
  onCreateDeck?: (deck: Deck) => void;
}

interface PrintingRowProps {
  card: Card;
  onSelect: (card: Card) => void;
}

function PrintingRow({ card, onSelect }: PrintingRowProps) {
  const { typography, colors } = useContext(StyleContext);

  const handlePress = useCallback(() => {
    onSelect(card);
  }, [card, onSelect]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.row,
        space.paddingM,
        { borderBottomWidth: 1, borderBottomColor: colors.L10 },
      ]}
    >
      <View style={styles.iconContainer}>
        <EncounterIcon
          encounter_code={card.pack_code}
          size={28}
          color={colors.darkText}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={[typography.text, typography.dark]}>
          {card.pack_name}
        </Text>
        { card.position !== undefined && (
          <Text
            style={[
              typography.small,
              { color: colors.D10 },
              space.marginLeftXs,
            ]}
          >
            #{card.position}
          </Text>
        ) }
      </View>
    </TouchableOpacity>
  );
}

export default function SelectInvestigatorPrintingDialog() {
  const route = useRoute<RouteProp<RootStackParamList, 'Deck.SelectPrinting'>>();
  const { investigatorCode, campaignId, onCreateDeck } = route.params;
  const navigation = useNavigation();
  const { backgroundStyle, colors, typography } = useContext(StyleContext);

  const [investigator] = useSingleCard(investigatorCode, 'player');
  const [allPrintings] = useAlternatePrintings(investigator);

  // Filter out parallel investigators (those from parallel packs)
  const nonParallelPrintings = useMemo(() => {
    return filter(allPrintings, card => {
      // Exclude cards from return_to_* packs which contain parallel investigators
      return !card.pack_code.startsWith('rtp') && !card.pack_code.startsWith('parallel');
    });
  }, [allPrintings]);

  // Sort by pack position (chronological order)
  const sortedPrintings = useMemo(() => {
    return [...nonParallelPrintings].sort((a, b) => {
      return (a.position || 0) - (b.position || 0);
    });
  }, [nonParallelPrintings]);

  const handleSelect = useCallback((selectedCard: Card) => {
    navigation.replace('Deck.NewOptions', {
      campaignId,
      investigatorId: selectedCard.alternate_of_code ?? selectedCard.code,
      onCreateDeck,
      alternateInvestigatorId: selectedCard.alternate_of_code ? selectedCard.code : undefined,
      headerBackgroundColor: colors.faction[selectedCard.factionCode()].background,
    });
  }, [navigation, campaignId, onCreateDeck, colors]);

  // If only one printing, skip this dialog
  if (sortedPrintings.length <= 1 && investigator) {
    handleSelect(investigator);
    return null;
  }

  return (
    <View style={[styles.container, backgroundStyle]}>
      <View style={[space.paddingM, space.paddingBottomS]}>
        <Text style={[typography.large, typography.center, typography.dark]}>
          {t`Select Printing`}
        </Text>
        { investigator && (
          <Text style={[typography.text, typography.center, { color: colors.D10 }, space.marginTopS]}>
            {investigator.name}
          </Text>
        ) }
      </View>
      <ScrollView>
        { map(sortedPrintings, card => (
          <PrintingRow
            key={card.code}
            card={card}
            onSelect={handleSelect}
          />
        )) }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  iconContainer: {
    marginRight: s,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
});
