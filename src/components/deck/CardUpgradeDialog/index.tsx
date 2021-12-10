import React, { useCallback, useContext, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
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
import Card from '@data/types/Card';
import { NavigationProps } from '@components/nav/types';
import space, { m } from '@styles/space';
import DeckNavFooter, { FOOTER_HEIGHT } from '@components/deck/DeckNavFooter';
import { getPacksInCollection, AppState } from '@reducers';
import StyleContext from '@styles/StyleContext';
import { PARALLEL_SKIDS_CODE, PARALLEL_AGNES_CODE, SHREWD_ANALYSIS_CODE, UNIDENTIFIED_UNTRANSLATED } from '@app_constants';
import ArkhamButton from '@components/core/ArkhamButton';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import { useSimpleDeckEdits } from '@components/deck/hooks';
import { useNavigationButtonPressed, usePlayerCards } from '@components/core/hooks';
import DeckProblemBanner from '../DeckProblemBanner';
import { useDialog } from '../dialogs';
import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';
import { DeckId } from '@actions/types';

export interface CardUpgradeDialogProps {
  componentId: string;
  id: DeckId;
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
  const originalCodes = useMemo(() => {
    if (!deckEdits?.slots) {
      return new Set();
    }
    return new Set(map(filter(cardsByName, c => !!deckEdits.slots[c.code]), c => c.code));
    // Intentionally only updating when we gain/lose slot changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!deckEdits?.slots, cardsByName]);
  const dispatch = useDispatch();
  const { backgroundStyle, borderStyle, typography, width } = useContext(StyleContext);
  const inCollection = useSelector(getPacksInCollection);
  const ignore_collection = useSelector((state: AppState) => !!state.settings.ignore_collection);
  const [showNonCollection, setShowNonCollection] = useState(false);
  const [shrewdAnalysisResult, setShrewdAnalysisResult] = useState<string[]>([]);
  const backPressed = useCallback(() => {
    Navigation.pop(componentId);
  }, [componentId]);
  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'back') {
      Navigation.pop(componentId);
    }
  }, componentId, [componentId]);

  const dedupedCardsByName = useMemo(() => {
    const reprints = filter(cardsByName, c => !!c.duplicate_of_code);
    const cardsToDrop = new Set(map(reprints, c => {
      if (originalCodes.has(c.code)) {
        return c.duplicate_of_code;
      }
      return c.code;
    }));
    return filter(cardsByName, c => !cardsToDrop.has(c.code));
  }, [cardsByName, originalCodes]);

  const namedCards = useMemo(() => {
    if (!deckEdits) {
      return [];
    }
    const validation = new DeckValidation(investigator, deckEdits.slots, deckEdits.meta);
    return sortBy(
      filter(dedupedCardsByName,
        card => validation.canIncludeCard(card, false)),
      card => card.xp || 0
    );
  }, [dedupedCardsByName, investigator, deckEdits]);
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
      card.pack_code === 'core' ||
      ignore_collection ||
      inCollection[card.pack_code] ||
      !!find(card.reprint_pack_codes || [], pack_code => inCollection[pack_code]) ||
      showNonCollection
    );
  }, [inCollection, showNonCollection, ignore_collection]);

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

  const shrewdAnalysisContent = useMemo(() => {
    if (!deckEdits) {
      return;
    }
    const [inCollection] = partition(namedCards, card => cardInCollection(card) || deckEdits.slots[card.code] > 0);
    const [baseCards, eligibleCards] = partition(inCollection, card => shrewdAnalysisRule(card));
    if (eligibleCards.length && baseCards.length) {
      const baseCard = baseCards[0];
      const sampleCard = eligibleCards[0];
      const xpCost = (sampleCard.xp || 0) + (sampleCard.extra_xp || 0) - ((baseCard.xp || 0) + (baseCard.extra_xp || 0));
      const upgradeCardsArray = map(eligibleCards, eligibleCards => `\t- ${eligibleCards.subname || eligibleCards.name}`);
      const upgradeCards = upgradeCardsArray.join('\n');
      return (
        <View style={[space.paddingTopM, space.paddingBottomM, space.paddingSideS]}>
          <Text style={[typography.text, space.paddingBottomS]}>
            { ngettext(
              msgid`This upgrade will cost ${xpCost} experience.`,
              `This upgrade will cost ${xpCost} experience.`,
              xpCost
            ) }
          </Text>
          <Text style={[typography.text, space.paddingBottomM]}>
            { ngettext(
              msgid`Two random cards will be chosen among the following choice:\n\n${upgradeCards}`,
              `Two random cards will be chosen among the following choices:\n\n${upgradeCards}`,
              upgradeCardsArray.length
            ) }
          </Text>
          <Text style={typography.text}>
            { t`You can edit your collection under Settings to adjust the eligible choices.` }
          </Text>
        </View>
      );
    }
    return null;
  }, [typography, cardInCollection, deckEdits, namedCards, shrewdAnalysisRule]);

  const { dialog: shrewdAnalysisDialog, setVisible: setShrewdAnalysisDialogVisible } = useDialog({
    title: t`Shrewd Analysis Rule`,
    content: shrewdAnalysisContent,
    confirm: {
      title: t`Upgrade`,
      onPress: doShrewdAnalysis,
    },
    dismiss: {
      title: t`Cancel`,
    },
  });

  const askShrewdAnalysis = useCallback(() => {
    setShrewdAnalysisDialogVisible(true);
  }, [setShrewdAnalysisDialogVisible]);

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
      <ScrollView
        overScrollMode="never"
        bounces={false}
      >
        { cardsSection }
        <View style={styles.footerPadding} />
      </ScrollView>
      <DeckNavFooter componentId={componentId} deckId={id} onPress={backPressed} />
      { overLimit && (
        <DeckProblemBanner problem={{ reason: 'too_many_copies' }} />
      ) }
      { shrewdAnalysisDialog }
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
    height: FOOTER_HEIGHT + NOTCH_BOTTOM_PADDING,
  },
  shrewdAnalysisResults: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
