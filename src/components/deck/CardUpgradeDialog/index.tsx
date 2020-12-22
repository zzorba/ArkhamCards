import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { filter, find, map, reverse, partition, sortBy, sumBy, shuffle, flatMap, uniq } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { t, ngettext, msgid } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import CardTextComponent from '@components/card/CardTextComponent';
import CardUpgradeOption from './CardUpgradeOption';
import CardDetailComponent from '@components/card/CardDetailView/CardDetailComponent';
import { incIgnoreDeckSlot, decIgnoreDeckSlot, incDeckSlot, decDeckSlot, setDeckXpAdjustment } from '@components/deck/actions';
import DeckValidation from '@lib/DeckValidation';
import Card from '@data/Card';
import { NavigationProps } from '@components/nav/types';
import space, { m } from '@styles/space';
import DeckNavFooter from '@components/deck/NewDeckNavFooter';
import { getPacksInCollection } from '@reducers';
import StyleContext from '@styles/StyleContext';
import { PARALLEL_SKIDS_CODE, PARALLEL_AGNES_CODE, SHREWD_ANALYSIS_CODE, UNIDENTIFIED_UNTRANSLATED } from '@app_constants';
import ArkhamButton from '@components/core/ArkhamButton';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import { useSimpleDeckEdits } from '@components/deck/hooks';
import { useNavigationButtonPressed, usePlayerCards } from '@components/core/hooks';
import DeckProblemBanner from '../DeckProblemBanner';

export interface CardUpgradeDialogProps {
  componentId: string;
  id: number;
  cardsByName: Card[];
  investigator: Card;
}

type Props = CardUpgradeDialogProps & NavigationProps;

function ignoreRule(code: string) {
  switch (code) {
    case PARALLEL_SKIDS_CODE:
      return {
        text: t`<b>Additional Options</b>: When you upgrade a [[Fortune]] or [[Gambit]] card, you may instead pay the full experience cost on the higher level version and leave the lower level version in your deck (it does not count towards your deck size or the number of copies of that card in your deck).`,
        traits: ['#gambit#', '#fortune#'],
      };
    case PARALLEL_AGNES_CODE:
      return {
        text: t`<b>Additional Options</b>: When you upgrade a [[Spell]], you may instead pay the full experience cost on the higher level version and leave the lower level version in your deck (it does not count towards your deck size or the number of copies of that card in your deck).`,
        traits: ['#spell#'],
      };
    default:
      return undefined;
  }
}

export default function CardUpgradeDialog({
  componentId,
  cardsByName,
  investigator,
  id,
}: Props) {
  const cards = usePlayerCards();
  const deckEdits = useSimpleDeckEdits(id);
  const dispatch = useDispatch();
  const { backgroundStyle, borderStyle, typography } = useContext(StyleContext);
  const inCollection = useSelector(getPacksInCollection);
  const [showNonCollection, setShowNonCollection] = useState(false);
  const [shrewdAnalysisResult, setShrewdAnalysisResult] = useState<string[]>([]);

  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'back') {
      Navigation.pop(componentId);
    }
  }, componentId, [componentId]);

  const namedCards = useMemo(() => {
    if (!deckEdits) {
      return [];
    }
    const validation = new DeckValidation(investigator, deckEdits.slots, deckEdits.meta);
    return sortBy(
      filter(cardsByName,
        card => validation.canIncludeCard(card, false)),
      card => card.xp || 0
    );
  }, [cardsByName, investigator, deckEdits]);
  const onIncrementIgnore = useCallback((code: string) => {
    dispatch(incIgnoreDeckSlot(id, code));
  }, [dispatch, id]);

  const onDecrementIgnore = useCallback((code: string) => {
    dispatch(decIgnoreDeckSlot(id, code));
  }, [dispatch, id]);

  const onIncrement = useCallback((code: string) => {
    if (!deckEdits) {
      return;
    }
    const possibleDecrement = find(reverse(namedCards), card => {
      return (
        !!cards &&
        card.code !== code && deckEdits.slots[card.code] > 0 &&
        (deckEdits.ignoreDeckLimitSlots[card.code] || 0) < deckEdits.slots[card.code] &&
        (card.xp || 0) < (cards[code]?.xp || 0)
      );
    });
    dispatch(incDeckSlot(id, code));
    if (possibleDecrement) {
      dispatch(decDeckSlot(id, possibleDecrement.code));
    }
  }, [deckEdits, dispatch, cards, namedCards, id]);

  const onDecrement = useCallback((code: string) => {
    dispatch(decDeckSlot(id, code));
  }, [dispatch, id]);

  const overLimit = useMemo(() => {
    if (!deckEdits) {
      return false;
    }
    const limit = (namedCards && namedCards.length) ?
      (namedCards[0].deck_limit || 2) :
      2;
    return sumBy(namedCards, card => (deckEdits.slots[card.code] || 0) - (deckEdits.ignoreDeckLimitSlots[card.code] || 0)) > limit;
  }, [deckEdits, namedCards]);

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

  const ignoreData = useMemo(() => ignoreRule(investigator.code), [investigator.code]);

  const specialIgnoreRule = useCallback((card: Card, highestLevel: boolean) => {
    return (!!ignoreData &&
      !highestLevel &&
      !!find(ignoreData.traits, trait => !!(card.real_traits_normalized && card.real_traits_normalized.indexOf(trait) !== -1))
    );
  }, [ignoreData]);
  const shrewdAnalysisRule = useCallback((card: Card) => {
    if (!deckEdits) {
      return false;
    }
    return (deckEdits.slots[SHREWD_ANALYSIS_CODE] > 0) && UNIDENTIFIED_UNTRANSLATED.has(card.code);
  }, [deckEdits]);
  const { width } = useWindowDimensions();
  const renderCard = useCallback((card: Card, highestLevel: boolean) => {
    const allowIgnore = specialIgnoreRule(card, highestLevel);
    return (
      <View style={[styles.column, borderStyle]} key={card.code}>
        <CardUpgradeOption
          key={card.code}
          card={card}
          code={card.code}
          count={deckEdits?.slots[card.code] || 0}
          ignoreCount={deckEdits?.ignoreDeckLimitSlots[card.code] || 0}
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
          width={width}
          simple
        />
      </View>
    );
  }, [componentId, deckEdits?.slots, deckEdits?.ignoreDeckLimitSlots, borderStyle, width,
    specialIgnoreRule, onIncrementIgnore, onDecrementIgnore, onIncrement, onDecrement]);

  const doShrewdAnalysis = useCallback(() => {
    if (!deckEdits) {
      return;
    }
    const [inCollection] = partition(
      namedCards,
      card => cardInCollection(card) || deckEdits.slots[card.code] > 0);
    const [baseCards, eligibleCards] = partition(inCollection, card => shrewdAnalysisRule(card));
    if (eligibleCards.length && baseCards.length) {
      const baseCard = baseCards[0];
      const firstCard = shuffle(eligibleCards)[0];
      const secondCard = shuffle(eligibleCards)[0];
      const xpCost = (firstCard.xp || 0) + (firstCard.extra_xp || 0) - ((baseCard.xp || 0) + (baseCard.extra_xp || 0));
      dispatch(decDeckSlot(id, baseCard.code));
      dispatch(decDeckSlot(id, baseCard.code));
      dispatch(incDeckSlot(id, firstCard.code));
      dispatch(incDeckSlot(id, secondCard.code));
      setShrewdAnalysisResult([firstCard.code, secondCard.code]);
      dispatch(setDeckXpAdjustment(id, deckEdits.xpAdjustment + xpCost));
    }
  }, [deckEdits, namedCards, dispatch, id, cardInCollection, shrewdAnalysisRule]);

  const askShrewdAnalysis = useCallback(() => {
    if (!deckEdits) {
      return;
    }
    const [inCollection] = partition(
      namedCards,
      card => cardInCollection(card) || deckEdits.slots[card.code] > 0);
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
  }, [deckEdits, namedCards, doShrewdAnalysis, cardInCollection, shrewdAnalysisRule]);
  const shrewdAnalysisCards: Card[] = useMemo(() => {
    return flatMap(uniq(shrewdAnalysisResult), code => {
      const card = cards && cards[code];
      return card ? [card] : [];
    });
  }, [shrewdAnalysisResult, cards]);

  const cardsSection = useMemo(() => {
    if (!deckEdits) {
      return null;
    }
    const [inCollection, nonCollection] = partition(
      namedCards,
      card => cardInCollection(card) || deckEdits.slots[card.code] > 0);
    const cards = map(inCollection, card => {
      return {
        card,
        highestLevel: !find(inCollection, c => (c.xp || 0) > (card.xp || 0)),
      };
    });
    const ignoreRule = !!find(cards, ({ card, highestLevel }) => specialIgnoreRule(card, highestLevel));
    const hasShrewdAnalysisRule = !!find(cards, ({ card }) => shrewdAnalysisRule(card) && deckEdits.slots[card.code] >= 2);
    return (
      <>
        { ignoreRule && !!ignoreData && (
          <View style={space.paddingM}>
            <CardTextComponent text={ignoreData.text} />
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
                { map(shrewdAnalysisCards, (card, idx) => (
                  <CardSearchResult
                    key={idx}
                    card={card}
                    control={{
                      type: 'count',
                      count: deckEdits.slots[card.code] || 0,
                    }}
                  />
                )) }
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
  }, [deckEdits, borderStyle, namedCards, typography, shrewdAnalysisCards, cardInCollection, specialIgnoreRule, ignoreData, shrewdAnalysisRule, askShrewdAnalysis, renderCard, showNonCollectionPressed]);
  return (
    <View
      style={[styles.wrapper, backgroundStyle]}
    >
      { overLimit && (
        <DeckProblemBanner faction={investigator.factionCode()} problem={{ reason: 'too_many_copies' }} />
      ) }
      <ScrollView
        overScrollMode="never"
        bounces={false}
      >
        { cardsSection }
        <View style={styles.footerPadding} />
      </ScrollView>
      <DeckNavFooter componentId={componentId} deckId={id} />
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
  footerPadding: {
    height: m,
  },
  shrewdAnalysisResults: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
