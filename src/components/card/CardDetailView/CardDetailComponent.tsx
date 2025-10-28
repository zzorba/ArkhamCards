import React, { useCallback, useContext, useMemo } from 'react';
import { map } from 'lodash';
import { StyleSheet, Text, View } from 'react-native';

import { t } from 'ttag';

import ArkhamButton from '@components/core/ArkhamButton';
import Card from '@data/types/Card';
import BondedCardsComponent from './BondedCardsComponent';
import TwoSidedCardComponent from './TwoSidedCardComponent';
import SignatureCardsComponent from './SignatureCardsComponent';
import space, { m, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useParallelInvestigator } from '@components/core/hooks';
import CardDetailSectionHeader from './CardDetailSectionHeader';
import { useNavigation } from '@react-navigation/native';

interface Props {
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

function InvestigatorInfoComponent({ card, width, simple, showInvestigatorCards }: Props) {
  const navigation = useNavigation();
  const { colors, typography } = useContext(StyleContext);
  const [parallelInvestigators] = useParallelInvestigator(card.type_code === 'investigator' ? card.code : undefined);
  const showInvestigatorCardsPressed = useCallback(() => {
    showInvestigatorCards && showInvestigatorCards(card.code);
  }, [card, showInvestigatorCards]);
  const parallelInvestigator = parallelInvestigators.length > 0 ? parallelInvestigators[0] : undefined;
  const showParallelInvestigatorCardsPressed = useCallback(() => {
    showInvestigatorCards && parallelInvestigator && showInvestigatorCards(parallelInvestigator.code);
  }, [showInvestigatorCards, parallelInvestigator]);

  const showCreateDeck = useCallback(() => {
    navigation.navigate('Deck.NewOptions', {
      campaignId: undefined,
      investigatorId: card.code,
      onCreateDeck: undefined,
      alternateInvestigatorId: undefined,
    });
  }, [navigation, card]);

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
        investigator={card}
        width={width}
        parallelInvestigator={parallelInvestigator}
      />
    </View>
  );
}

function SpoilersComponent({ card, width, toggleShowSpoilers }: Props) {
  const navigation = useNavigation();
  const { backgroundStyle, typography } = useContext(StyleContext);
  const toggleShowSpoilersPressed = useCallback(() => {
    toggleShowSpoilers && toggleShowSpoilers(card.code);
  }, [card, toggleShowSpoilers]);

  const editSpoilersPressed = useCallback(() => {
    navigation.navigate('My.Spoilers');
  }, [navigation]);
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
  card, backCard, width, showSpoilers, tabooSetId, simple, noImage,
  toggleShowSpoilers, showInvestigatorCards,
}: Props) {
  const { backgroundStyle } = useContext(StyleContext);
  const shouldBlur = !showSpoilers && !!(card && card.mythos_card);
  const bondedCards = useMemo(() => [card], [card]);
  if (shouldBlur) {
    return (
      <SpoilersComponent
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
          card={card}
          backCard={backCard}
          width={width}
          simple={!!simple}
          noImage={noImage}
        />
        { !simple && (
          <BondedCardsComponent
            cards={bondedCards}
            width={width}
            tabooSetId={tabooSetId}
          />
        ) }
      </View>
      { card.type_code === 'investigator' && !simple && (
        <InvestigatorInfoComponent
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
