import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { flatMap, forEach, map, min, max, groupBy } from 'lodash';
import { t } from 'ttag';

import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import withCampaignGuideContext, { CampaignGuideInputProps, CampaignGuideProps } from '@components/campaignguide/withCampaignGuideContext';
import Card, { CardsMap } from '@data/Card';
import CardListWrapper from '@components/card/CardListWrapper';
import space from '@styles/space';
import { CardErrata } from '@data/scenario/types';
import EncounterIcon from '@icons/EncounterIcon';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

export interface EncounterCardErrataProps extends CampaignGuideInputProps {
  encounterSets: string[];
}

type Props = EncounterCardErrataProps & CampaignGuideProps & DimensionsProps;

class EncounterCardErrataView extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  static options() {
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
  }

  _renderErrata = (errata: CardErrata, key: number, allCards: CardsMap) => {
    const { fontScale, colors, typography } = this.context;
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
  };

  render() {
    const { encounterSets, campaignData } = this.props;
    const { colors } = this.context;
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
                  { map(errata, (e, idx) => this._renderErrata(e, idx, cardsMap)) }
                </>
              ) }
            </ScrollView>
          );
        } }
      </CardListWrapper>
    );
  }
}

export default withCampaignGuideContext(
  withDimensions(EncounterCardErrataView)
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  entry: {
    flexDirection: 'column',
  },
});
