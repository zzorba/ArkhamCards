import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { filter, find, map, reverse, partition, sortBy, sumBy, shuffle, flatMap, uniq } from 'lodash';
import { useSelector } from 'react-redux';
import { t, ngettext, msgid } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import CardTextComponent from '@components/card/CardTextComponent';
import CardUpgradeOption from './CardUpgradeOption';
import DeckProblemRow from '@components/core/DeckProblemRow';
import CardDetailComponent from '@components/card/CardDetailView/CardDetailComponent';
import { Deck, DeckMeta, Slots } from '@actions/types';
import DeckValidation from '@lib/DeckValidation';
import Card, { CardsMap } from '@data/Card';
import COLORS from '@styles/colors';
import { NavigationProps } from '@components/nav/types';
import space, { m, s, xs } from '@styles/space';
import DeckNavFooter from '../../DeckNavFooter';
import { parseDeck } from '@lib/parseDeck';
import { getPacksInCollection } from '@reducers';
import StyleContext from '@styles/StyleContext';
import { PARALLEL_SKIDS_CODE, SHREWD_ANALYSIS_CODE, UNIDENTIFIED_UNTRANSLATED } from '@app_constants';
import ArkhamButton from '@components/core/ArkhamButton';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import { useNavigationButtonPressed, useSlots } from '@components/core/hooks';

export interface CardUpgradeDialogProps {
  componentId: string;
  card?: Card;
  cards: CardsMap;
  cardsByName: {
    [name: string]: Card[];
  };
  slots: Slots;
  ignoreDeckLimitSlots: Slots;
  investigator: Card;
  meta: DeckMeta;
  deck: Deck;
  previousDeck?: Deck;
  tabooSetId?: number;
  updateSlots: (slots: Slots) => void;
  updateIgnoreDeckLimitSlots: (slots: Slots) => void;
  updateXpAdjustment: (xpAdjustment: number) => void;
  xpAdjustment: number;
}

type Props = CardUpgradeDialogProps & NavigationProps;

export default function CardUpgradeDialog({
  componentId,
  card,
  cards,
  cardsByName,
  investigator,
  meta,
  deck,
  previousDeck,
  slots: originalSlots,
  ignoreDeckLimitSlots: originalIgnoreDeckLimitSlots,
  tabooSetId,
  updateSlots: updateActualSlots,
  updateIgnoreDeckLimitSlots: updateActualIgnoreDeckLimitSlots,
  updateXpAdjustment,
  xpAdjustment: originalXpAdjustment,
}: Props) {
  const { backgroundStyle, borderStyle, typography } = useContext(StyleContext);
  const inCollection = useSelector(getPacksInCollection);
  const [slots, updateSlots] = useSlots(originalSlots, updateActualSlots);
  const [ignoreDeckLimitSlots, updateIgnoreDeckLimitSlots] = useSlots(originalIgnoreDeckLimitSlots, updateActualIgnoreDeckLimitSlots);
  const [xpAdjustment, setXpAdjustment] = useState(originalXpAdjustment);
  const [showNonCollection, setShowNonCollection] = useState(false);
  const [shrewdAnalysisResult, setShrewdAnalysisResult] = useState<string[]>([]);

  const parsedDeck = useMemo(() => {
    return parseDeck(deck, meta, slots, ignoreDeckLimitSlots || {}, cards, previousDeck);
  }, [cards, deck, previousDeck, meta, slots, ignoreDeckLimitSlots]);

  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'back') {
      Navigation.pop(componentId);
    }
  }, componentId, [componentId]);

  const namedCards = useMemo(() => {
    const validation = new DeckValidation(investigator, slots, meta);
    return sortBy(
      filter((card && cardsByName[card.real_name]) || [],
        card => validation.canIncludeCard(card, false)),
      card => card.xp || 0
    );
  }, [card, cardsByName, investigator, meta, slots]);
  const onIncrementIgnore = useCallback((code: string) => {
    updateIgnoreDeckLimitSlots({ type: 'inc-slot', code });
  }, [updateIgnoreDeckLimitSlots]);

  const onDecrementIgnore = useCallback((code: string) => {
    updateIgnoreDeckLimitSlots({ type: 'dec-slot', code });
  }, [updateIgnoreDeckLimitSlots]);

  const onIncrement = useCallback((code: string) => {
    updateSlots({ type: 'inc-slot', code });
    const possibleDecrement = find(reverse(namedCards), card => {
      return (
        card.code !== code && slots[card.code] > 0 &&
        (ignoreDeckLimitSlots[card.code] || 0) < slots[card.code] &&
        (card.xp || 0) < (cards[code]?.xp || 0)
      );
    });

    if (possibleDecrement) {
      updateSlots({ type: 'dec-slot', code: possibleDecrement.code });
    }
  }, [slots, updateSlots, cards, namedCards, ignoreDeckLimitSlots]);

  const onDecrement = useCallback((code: string) => {
    updateSlots({ type: 'dec-slot', code });
  }, [updateSlots]);

  const overLimit = useMemo(() => {
    const limit = (namedCards && namedCards.length) ?
      (namedCards[0].deck_limit || 2) :
      2;
    return sumBy(namedCards, card => (slots[card.code] || 0) - (ignoreDeckLimitSlots[card.code] || 0)) > limit;
  }, [slots, namedCards, ignoreDeckLimitSlots]);

  const showNonCollectionPressed = useCallback(() => {
    setShowNonCollection(true);
  }, [setShowNonCollection]);

  const cardInCollection = useCallback((card: Card): boolean => {
    return (
      card.code === 'core' ||
      inCollection[card.pack_code] ||
      showNonCollection
    );
  }, [inCollection, showNonCollection]);

  const specialSkidsRule = useCallback((card: Card, highestLevel: boolean) => {
    return investigator.code === PARALLEL_SKIDS_CODE &&
      card.real_traits_normalized &&
      (card.real_traits_normalized.indexOf('#gambit#') !== -1 || card.real_traits_normalized.indexOf('#fortune#') !== -1) &&
      !highestLevel;
  }, [investigator]);

  const shrewdAnalysisRule = useCallback((card: Card) => {
    return (slots[SHREWD_ANALYSIS_CODE] > 0) && UNIDENTIFIED_UNTRANSLATED.has(card.code);
  }, [slots]);
  const { width } = useWindowDimensions();
  const renderCard = useCallback((card: Card, highestLevel: boolean) => {
    const allowIgnore = specialSkidsRule(card, highestLevel);
    return (
      <View style={[styles.column, borderStyle]} key={card.code}>
        <CardUpgradeOption
          key={card.code}
          card={card}
          code={card.code}
          count={slots[card.code] || 0}
          ignoreCount={ignoreDeckLimitSlots[card.code] || 0}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onIgnore={allowIgnore ? {
            onIncrement: onIncrementIgnore,
            onDecrement: onDecrementIgnore,
          } : undefined}
        />
        <CardDetailComponent
          componentId={componentId}
          card={card}
          showSpoilers
          tabooSetId={tabooSetId}
          width={width}
          simple
        />
      </View>
    );
  }, [componentId, tabooSetId, slots, ignoreDeckLimitSlots, borderStyle, width,
    specialSkidsRule, onIncrementIgnore, onDecrementIgnore, onIncrement, onDecrement]);

  const doShrewdAnalysis = useCallback(() => {
    const [inCollection] = partition(
      namedCards,
      card => cardInCollection(card) || slots[card.code] > 0);
    const [baseCards, eligibleCards] = partition(inCollection, card => shrewdAnalysisRule(card));
    if (eligibleCards.length && baseCards.length) {
      const baseCard = baseCards[0];
      const firstCard = shuffle(eligibleCards)[0];
      const secondCard = shuffle(eligibleCards)[0];
      const xpCost = (firstCard.xp || 0) + (firstCard.extra_xp || 0) - ((baseCard.xp || 0) + (baseCard.extra_xp || 0));
      updateSlots({ type: 'dec-slot', code: baseCard.code });
      updateSlots({ type: 'dec-slot', code: baseCard.code });
      updateSlots({ type: 'inc-slot', code: firstCard.code });
      updateSlots({ type: 'inc-slot', code: secondCard.code });
      setShrewdAnalysisResult([firstCard.code, secondCard.code]);
      const newXpAdjustment = xpAdjustment + xpCost;
      setXpAdjustment(newXpAdjustment);
      updateXpAdjustment(newXpAdjustment);
    }
  }, [slots, xpAdjustment, namedCards, updateSlots, setXpAdjustment, cardInCollection, shrewdAnalysisRule, updateXpAdjustment]);

  const askShrewdAnalysis = useCallback(() => {
    const [inCollection] = partition(
      namedCards,
      card => cardInCollection(card) || slots[card.code] > 0);
    const [baseCards, eligibleCards] = partition(inCollection, card => shrewdAnalysisRule(card));
    if (eligibleCards.length && baseCards.length) {
      const baseCard = baseCards[0];
      const sampleCard = eligibleCards[0];
      const xpCost = (sampleCard.xp || 0) + (sampleCard.extra_xp || 0) - ((baseCard.xp || 0) + (baseCard.extra_xp || 0));
      const upgradeCards = map(eligibleCards, eligibleCards => eligibleCards.subname || eligibleCards.name).join('\n');
      Alert.alert(
        t`Shrewd Analysis Rule`,
        [
          ngettext(
            msgid`This upgrade will cost ${xpCost} experience.`,
            `This upgrade will cost ${xpCost} experience.`,
            xpCost
          ),
          ngettext(
            msgid`Two random cards will be chosen among the following choice:\n\n${upgradeCards}`,
            `Two random cards will be chosen among the following choices:\n\n${upgradeCards}`,
            upgradeCards.length
          ),
          t`You can edit your collection under Settings to adjust the eligible choices.`,
        ].join('\n\n'),
        [
          {
            text: t`Upgrade`,
            onPress: doShrewdAnalysis,
          },
          {
            text: t`Cancel`,
            style: 'cancel',
          },
        ]
      );
    }
  }, [slots, namedCards, doShrewdAnalysis, cardInCollection, shrewdAnalysisRule]);
  const shrewdAnalysisCards: Card[] = useMemo(() => {
    return flatMap(uniq(shrewdAnalysisResult), code => {
      const card = cards[code];
      return card ? [card] : [];
    });
  }, [shrewdAnalysisResult, cards]);

  const cardsSection = useMemo(() => {
    const [inCollection, nonCollection] = partition(
      namedCards,
      card => cardInCollection(card) || slots[card.code] > 0);
    const cards = map(inCollection, card => {
      return {
        card,
        highestLevel: !find(inCollection, c => (c.xp || 0) > (card.xp || 0)),
      };
    });
    const skidsRule = !!find(cards, ({ card, highestLevel }) => specialSkidsRule(card, highestLevel));
    const hasShrewdAnalysisRule = !!find(cards, ({ card }) => shrewdAnalysisRule(card) && slots[card.code] >= 2);
    return (
      <>
        { skidsRule && (
          <View style={space.paddingM}>
            <CardTextComponent
              text={t`<b>Additional Options</b>: When you upgrade a [[Fortune]] or [[Gambit]] card, you may instead pay the full experience cost on the higher level version and leave the lower level version in your deck (it does not count towards your deck size or the number of copies of that card in your deck).` }
            />
          </View>
        ) }
        { (hasShrewdAnalysisRule || !!shrewdAnalysisCards.length) && (
          <>
            <View style={space.paddingM}>
              <CardTextComponent
                text={t`<b>Shrewd Analysis</b>: If you meet the campaign conditions, you may use Shrewd Analysis to choose both upgrades randomly and only pay for one.\n\n<i>Note: the app handles this by adjusting experience to account for the 'free' upgrade.</i>` }
              />
            </View>
            { shrewdAnalysisCards.length ? (
              <>
                <View style={[styles.shrewdAnalysisResults, borderStyle]}>
                  <Text style={[typography.text, typography.light, typography.right, space.paddingS, space.paddingRightM]}>
                    { t`Upgrade results` }
                  </Text>
                </View>
                { map(shrewdAnalysisCards, (card, idx) => <CardSearchResult key={idx} card={card} count={slots[card.code] || 0} />) }
              </>
            ) : (
              <ArkhamButton title={t`Upgrade with Shrewd Analysis`} icon="up" onPress={askShrewdAnalysis} />
            ) }
          </>
        ) }
        { map(cards, ({ card, highestLevel }) => renderCard(card, highestLevel)) }
        { nonCollection.length > 0 ? (
          <BasicButton
            key="non-collection"
            title={ngettext(
              msgid`Show ${nonCollection.length} non-collection card`,
              `Show ${nonCollection.length} non-collection cards`,
              nonCollection.length
            )}
            onPress={showNonCollectionPressed}
          />
        ) : null }
      </>
    );
  }, [slots, borderStyle, namedCards, typography, shrewdAnalysisCards, cardInCollection, specialSkidsRule, shrewdAnalysisRule, askShrewdAnalysis, renderCard, showNonCollectionPressed]);

  const footer = useMemo(() => {
    if (!parsedDeck) {
      return null;
    }

    return (
      <DeckNavFooter
        componentId={componentId}
        parsedDeck={parsedDeck}
        xpAdjustment={xpAdjustment}
      />
    );
  }, [componentId, parsedDeck, xpAdjustment]);


  const isSurvivor = investigator.faction_code === 'survivor';
  return (
    <View
      style={[styles.wrapper, backgroundStyle]}
    >
      <ScrollView
        overScrollMode="never"
        bounces={false}
      >
        { overLimit && (
          <View style={[styles.problemBox,
            { backgroundColor: isSurvivor ? COLORS.yellow : COLORS.red },
          ]}>
            <DeckProblemRow
              problem={{ reason: 'too_many_copies' }}
              color={isSurvivor ? COLORS.black : COLORS.white}
              fontSize={14}
            />
          </View>
        ) }
        { cardsSection }
        <View style={styles.footerPadding} />
      </ScrollView>
      { footer }
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    paddingTop: m,
    paddingBottom: m,
    flexDirection: 'column',
    borderBottomWidth: 1,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  problemBox: {
    flex: 1,
    paddingTop: xs,
    paddingBottom: xs,
    paddingRight: s,
    paddingLeft: s,
  },
  footerPadding: {
    height: m,
  },
  shrewdAnalysisResults: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
