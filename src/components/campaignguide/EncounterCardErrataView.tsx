import React, { useCallback, useContext } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { flatMap, forEach, map, min, max, groupBy } from 'lodash';
import { t } from 'ttag';

import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import withCampaignGuideContext, { CampaignGuideInputProps, CampaignGuideProps } from '@components/campaignguide/withCampaignGuideContext';
import Card, { CardsMap } from '@data/Card';
import CardListWrapper from '@components/card/CardListWrapper';
import space from '@styles/space';
import { CardErrata } from '@data/scenario/types';
import EncounterIcon from '@icons/EncounterIcon';
import StyleContext from '@styles/StyleContext';

export interface EncounterCardErrataProps extends CampaignGuideInputProps {
  encounterSets: string[];
}

type Props = EncounterCardErrataProps & CampaignGuideProps;

function EncounterCardErrataView({ encounterSets, campaignData }: Props) {
  const { fontScale, colors, typography } = useContext(StyleContext);

  const renderErrata = useCallback((errata: CardErrata, key: number, allCards: CardsMap) => {
    const cardsByName = groupBy(
      flatMap(errata.code, code => {
        const card = allCards[code];
        return card ? [card] : [];
      }),
      card => card.name
    );
    return (
      <View style={styles.entry} key={key}>
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
  }, [fontScale, colors, typography]);

  const errata = campaignData.campaignGuide.cardErrata(encounterSets);
  return (
    <CardListWrapper
      codes={flatMap(errata, e => e.code)}
      type="encounter"
    >
      { (cards: Card[], loading: boolean) => {
        const cardsMap: CardsMap = {};
        forEach(cards, card => {
          cardsMap[card.code] = card;
        });
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
                { map(errata, (e, idx) => renderErrata(e, idx, cardsMap)) }
              </>
            ) }
          </ScrollView>
        );
      } }
    </CardListWrapper>
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
