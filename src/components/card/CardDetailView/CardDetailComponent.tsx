import React, { useCallback, useContext, useMemo } from 'react';
import { map } from 'lodash';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { t } from 'ttag';

import ArkhamButton from '@components/core/ArkhamButton';
import Card from '@data/types/Card';
import BondedCardsComponent from './BondedCardsComponent';
import TwoSidedCardComponent from './TwoSidedCardComponent';
import SignatureCardsComponent from './SignatureCardsComponent';
import space, { m, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useParallelInvestigators } from '@components/core/hooks';
import CardDetailSectionHeader from './CardDetailSectionHeader';
import { getDeckOptions } from '@components/nav/helper';

interface Props {
  componentId?: string;
  card: Card;
  backCard?: Card;
  width: number;
  simple?: boolean;
  noImage?: boolean;
  showSpoilers: boolean;
  tabooSetId?: number | undefined;
  toggleShowSpoilers?: (code: string) => void;
  showInvestigatorCards?: (code: string) => void;
}

function InvestigatorInfoComponent({ componentId, card, width, simple, showInvestigatorCards }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const [parallelInvestigators] = useParallelInvestigators(card.type_code === 'investigator' ? card.code : undefined);
  const showInvestigatorCardsPressed = useCallback(() => {
    showInvestigatorCards && showInvestigatorCards(card.code);
  }, [card, showInvestigatorCards]);
  const parallelInvestigator = parallelInvestigators.length > 0 ? parallelInvestigators[0] : undefined;
  const showParallelInvestigatorCardsPressed = useCallback(() => {
    showInvestigatorCards && parallelInvestigator && showInvestigatorCards(parallelInvestigator.code);
  }, [showInvestigatorCards, parallelInvestigator]);

  const showCreateDeck = useCallback(() => {
    if (componentId) {
      Navigation.showModal({
        stack: {
          children: [{
            component: {
              name: 'Deck.NewOptions',
              passProps: {
                campaignId: undefined,
                investigatorId: card.code,
                onCreateDeck: undefined,
                isModal: true,
              },
              options: {
                ...getDeckOptions(colors, { title: t`New Deck`, modal: true }, card),
                modalPresentationStyle: Platform.OS === 'ios' ?
                  OptionsModalPresentationStyle.fullScreen :
                  OptionsModalPresentationStyle.overCurrentContext,
                bottomTabs: {},
              },
            },
          }],
        },
      });
    }
  }, [componentId, card, colors]);

  if (!card || card.type_code !== 'investigator' || card.encounter_code !== null) {
    return null;
  }
  return (
    <View style={styles.investigatorContent}>
      { parallelInvestigators.length > 0 && (
        <>
          <CardDetailSectionHeader title={t`Parallel`} />
          { map(parallelInvestigators, parallel => (
            <TwoSidedCardComponent
              key={parallel.code}
              componentId={componentId}
              card={parallel}
              width={width}
              simple={!!simple}
            />
          )) }
        </>
      ) }
      <View style={styles.maxWidth}>
        <View style={[styles.deckbuildingSection, { backgroundColor: colors.L20 }]}>
          <Text style={[typography.large, typography.center, typography.uppercase]}>
            { t`Deckbuilding` }
          </Text>
        </View>
        <ArkhamButton
          icon="card"
          title={t`Show all available cards`}
          onPress={showInvestigatorCardsPressed}
        />
        { !!parallelInvestigator && (
          <ArkhamButton
            key="parallel"
            icon="parallel"
            title={t`Show all available cards for parallel`}
            onPress={showParallelInvestigatorCardsPressed}
          />
        ) }
        <ArkhamButton
          icon="deck"
          title={t`Create new deck`}
          onPress={showCreateDeck}
        />
      </View>
      <SignatureCardsComponent
        componentId={componentId}
        investigator={card}
        width={width}
        parallelInvestigator={parallelInvestigator}
      />
    </View>
  );
}

function SpoilersComponent({ componentId, card, width, toggleShowSpoilers }: Props) {
  const { backgroundStyle, typography } = useContext(StyleContext);
  const toggleShowSpoilersPressed = useCallback(() => {
    toggleShowSpoilers && toggleShowSpoilers(card.code);
  }, [card, toggleShowSpoilers]);

  const editSpoilersPressed = useCallback(() => {
    if (componentId) {
      Navigation.push(componentId, {
        component: {
          name: 'My.Spoilers',
        },
      });
    }
  }, [componentId]);
  return (
    <View key={card.code} style={[styles.viewContainer, backgroundStyle, { width }]}>
      <Text style={[typography.text, space.paddingM]}>
        { t`Warning: this card contains possible spoilers for '${ card.pack_name }'.` }
      </Text>
      <View style={[styles.row, space.paddingSideS]}>
        <ArkhamButton grow icon="show" onPress={toggleShowSpoilersPressed} title={t`Show card`} />
      </View>
      <View style={[styles.row, space.paddingSideS]}>
        <ArkhamButton grow icon="edit" onPress={editSpoilersPressed} title={t`Edit my spoiler settings`} />
      </View>
    </View>
  );
}

export default function CardDetailComponent({
  componentId, card, backCard, width, showSpoilers, tabooSetId, simple, noImage,
  toggleShowSpoilers, showInvestigatorCards,
}: Props) {
  const { backgroundStyle } = useContext(StyleContext);
  const shouldBlur = !showSpoilers && !!(card && card.mythos_card);
  const bondedCards = useMemo(() => [card], [card]);
  if (shouldBlur) {
    return (
      <SpoilersComponent
        componentId={componentId}
        card={card}
        width={width}
        showSpoilers={showSpoilers}
        simple={simple}
        toggleShowSpoilers={toggleShowSpoilers}
        showInvestigatorCards={showInvestigatorCards}
      />
    )
  }

  return (
    <View style={[styles.viewContainer, backgroundStyle]}>
      <View style={{ width }}>
        <TwoSidedCardComponent
          componentId={componentId}
          card={card}
          backCard={backCard}
          width={width}
          simple={!!simple}
          noImage={noImage}
        />
        { !simple && (
          <BondedCardsComponent
            componentId={componentId}
            cards={bondedCards}
            width={width}
            tabooSetId={tabooSetId}
          />
        ) }
      </View>
      { card.type_code === 'investigator' && !simple && (
        <InvestigatorInfoComponent
          componentId={componentId}
          card={card}
          width={width}
          showSpoilers={showSpoilers}
          simple={simple}
          toggleShowSpoilers={toggleShowSpoilers}
          showInvestigatorCards={showInvestigatorCards}
        />
      ) }
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  investigatorContent: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  maxWidth: {
    width: '100%',
    maxWidth: 768,
  },
  deckbuildingSection: {
    marginTop: m + s,
    marginLeft: -8,
    marginRight: -8,
    marginBottom: 8,
    padding: s,
    paddingTop: m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
