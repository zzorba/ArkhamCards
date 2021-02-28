import React, { useContext, useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { flatMap, forEach, map, min, max, groupBy } from 'lodash';
import { t } from 'ttag';

import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import withCampaignGuideContext, { CampaignGuideInputProps } from '@components/campaignguide/withCampaignGuideContext';
import { CardsMap } from '@data/types/Card';
import space from '@styles/space';
import { CardErrata } from '@data/scenario/types';
import EncounterIcon from '@icons/EncounterIcon';
import StyleContext from '@styles/StyleContext';
import useCardList from '@components/card/useCardList';
import CampaignGuideContext from './CampaignGuideContext';

export interface EncounterCardErrataProps extends CampaignGuideInputProps {
  encounterSets: string[];
}

function CardErrataComponent({ errata, cards }: { errata: CardErrata; cards: CardsMap }) {
  const { fontScale, colors, typography } = useContext(StyleContext);
  const cardsByName = useMemo(() => groupBy(
    flatMap(errata.code, code => {
      const card = cards[code];
      return card ? [card] : [];
    }),
    card => card.name
  ), [errata, cards]);
  return (
    <View style={styles.entry}>
      {map(cardsByName, (cards, name) => {
        return (
          <View style={space.marginS} key={name}>
            <Text style={[typography.text, typography.bold]}>
              {name}
              (
              { !!cards[0].cycle_code && (
                <EncounterIcon
                  encounter_code={cards[0].cycle_code}
                  size={16 * fontScale}
                  color={colors.darkText}
                />
              ) }
              &nbsp;
              { (cards.length > 1) ? (
                `${min(map(cards, card => card.position || 0))} - ${max(map(cards, card => card.position || 0))}`
              ) : (cards[0].position || 0)}
              )
            </Text>
            <CampaignGuideTextComponent text={errata.text} />
          </View>
        );
      })}
    </View>
  );
}
function EncounterCardErrataView({ encounterSets }: EncounterCardErrataProps) {
  const { colors } = useContext(StyleContext);
  const campaignData = useContext(CampaignGuideContext);
  const errata = useMemo(() => campaignData.campaignGuide.cardErrata(encounterSets), [campaignData.campaignGuide, encounterSets]);
  const errataCodes = useMemo(() => flatMap(errata, e => e.code), [errata]);
  const [errataCards, loading] = useCardList(errataCodes, 'encounter');
  const cardsMap = useMemo(() => {
    const result: CardsMap = {};
    forEach(errataCards, card => {
      result[card.code] = card;
    });
    return result;
  }, [errataCards]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      { loading ? (
        <ActivityIndicator
          style={space.paddingM}
          color={colors.lightText}
          size="large"
          animating
        />
      ) : (
        <>
          { map(errata, (e, idx) => <CardErrataComponent key={idx} errata={e} cards={cardsMap} />) }
        </>
      ) }
    </ScrollView>
  );
}

EncounterCardErrataView.options = () => {
  return {
    topBar: {
      title: {
        text: t`Encounter Card Errata`,
      },
      backButton: {
        title: t`Back`,
      },
    },
  };
};

export default withCampaignGuideContext(EncounterCardErrataView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  entry: {
    flexDirection: 'column',
  },
});
