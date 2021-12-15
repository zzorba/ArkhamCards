import React, { MutableRefObject, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { filter, find, flatMap, flatten, forEach, map, sum, sumBy, uniqBy } from 'lodash';
import { Text, ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { c, msgid, t } from 'ttag';

import {
  CardId,
  Deck,
  DeckId,
  DeckMeta,
  DeckProblem,
  EditDeckState,
  ParsedDeck,
  Slots,
  SplitCards,
} from '@actions/types';
import COLORS from '@styles/colors';
import { showCard, showCardSwipe } from '@components/nav/helper';
import DeckProgressComponent from '../DeckProgressComponent';
import { CardSectionHeaderData } from '@components/core/CardSectionHeader';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import { BODY_OF_A_YITHIAN, ENABLE_SIDE_DECK, RANDOM_BASIC_WEAKNESS, TypeCodeType } from '@app_constants';
import DeckValidation from '@lib/DeckValidation';
import Card, { CardsMap } from '@data/types/Card';
import TabooSet from '@data/types/TabooSet';
import space, { isBig, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useFlag } from '@components/core/hooks';
import { setDeckTabooSet, updateDeckMeta } from '@components/deck/actions';
import DeckSlotHeader from '@components/deck/section/DeckSlotHeader';
import DeckBubbleHeader from '@components/deck/section/DeckBubbleHeader';
import DeckSectionHeader from '@components/deck/section/DeckSectionHeader';
import DeckSectionBlock from '@components/deck/section/DeckSectionBlock';
import DeckMetadataComponent from './DeckMetadataComponent';
import RoundedFooterButton from '@components/core/RoundedFooterButton';
import DeckPickerStyleButton from '../controls/DeckPickerStyleButton';
import { useDeckXpStrings } from '../hooks';
import DeckMetadataControls from '../controls/DeckMetadataControls';
import { FOOTER_HEIGHT } from '@components/deck/DeckNavFooter';
import { ControlType } from '@components/cardlist/CardSearchResult/ControlComponent';
import { getPacksInCollection, AppState } from '@reducers';
import InvestigatorSummaryBlock from '@components/card/InvestigatorSummaryBlock';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';

interface SectionCardId extends CardId {
  mode: 'special' | 'side' | 'bonded' | undefined;
  hasUpgrades: boolean;
  index: number;
}

interface CardSection extends CardSectionHeaderData {
  id: string;
  cards: SectionCardId[];
  first?: boolean;
  last?: boolean;
}

interface DeckSection {
  title: string;
  onTitlePress?: () => void;
  sections: CardSection[];
  toggleCollapsed?: () => void;
  collapsed?: boolean;
}

function hasUpgrades(
  code: string,
  cards: CardsMap,
  cardsByName: { [name: string]: Card[] },
  validation: DeckValidation,
  inCollection: { [pack_code: string]: boolean },
  ignoreCollection: boolean,
): boolean {
  const card = cards[code];
  return !!(
    card &&
    card.has_upgrades &&
    find(cardsByName[card.real_name.toLowerCase()] || [], upgradeCard => (
      upgradeCard &&
      upgradeCard.code !== code &&
      (upgradeCard.xp || 0) > (card.xp || 0) &&
      validation.canIncludeCard(upgradeCard, false) &&
      (upgradeCard.pack_code === 'core' || ignoreCollection || inCollection[upgradeCard.pack_code])
    )));
}

function sectionHeaderTitle(type: TypeCodeType, count: number): string {
  switch (type) {
    case 'asset': return c('header').ngettext(msgid`Asset`, `Assets`, count);
    case 'event': return c('header').ngettext(msgid`Event`, `Events`, count);
    case 'skill': return c('header').ngettext(msgid`Skill`, `Skills`, count);
    case 'treachery': return c('header').ngettext(msgid`Treachery`, `Treacheries`, count);
    case 'enemy': return c('header').ngettext(msgid`Enemy`, `Enemies`, count);
    case 'location': return c('header').ngettext(msgid`Location`, `Locations`, count);
    case 'story': return c('header').ngettext(msgid`Story`, `Stories`, count);
    case 'act': return c('header').ngettext(msgid`Act`, `Acts`, count);
    case 'agenda': return c('header').ngettext(msgid`Agenda`, `Agendas`, count);
    case 'investigator': return c('header').ngettext(msgid`Investigator`, `Investigators`, count);
    case 'scenario': return c('header').ngettext(msgid`Scenario`, `Scenarios`, count);
  }
}

function deckToSections(
  title: string,
  onTitlePress: undefined | (() => void),
  index: number,
  halfDeck: SplitCards,
  cards: CardsMap,
  cardsByName: { [name: string]: Card[] },
  validation: DeckValidation,
  mode: 'special' | 'side' | undefined,
  inCollection: { [pack_code: string]: boolean },
  ignoreCollection: boolean,
  limitedSlots: boolean,
  limitedSlotsOnly?: boolean,
): [DeckSection, number] {
  const result: CardSection[] = [];
  if (halfDeck.Assets) {
    const assets = flatMap(halfDeck.Assets, subAssets => {
      const data = filter(subAssets.data, c => limitedSlotsOnly ? c.limited : (!c.limited || !limitedSlots));
      if (!data.length) {
        return [];
      }
      return {
        ...subAssets,
        data,
      };
    });
    const assetCount = sumBy(
      assets,
      subAssets => sum(subAssets.data.map(c => c.quantity))
    );
    if (assetCount > 0) {
      const assets = sectionHeaderTitle('asset', assetCount);
      result.push({
        id: `assets${mode ? `-${mode}` : ''}`,
        subTitle: `— ${assets} · ${assetCount} —`,
        cards: [],
      });
    }
    forEach(assets, (subAssets, idx) => {
      result.push({
        id: `asset${mode ? `-${mode}` : ''}-${idx}`,
        title: subAssets.type,
        cards: map(subAssets.data, c => {
          return {
            ...c,
            index: index++,
            mode,
            hasUpgrades: hasUpgrades(
              c.id,
              cards,
              cardsByName,
              validation,
              inCollection,
              ignoreCollection
            ),
          };
        }),
      });
    });
  }
  const splits: { cardType: TypeCodeType; cardSplitGroup?: CardId[] }[] = [
    {
      cardType: 'event',
      cardSplitGroup: halfDeck.Event,
    },
    {
      cardType: 'skill',
      cardSplitGroup: halfDeck.Skill,
    },
    {
      cardType: 'enemy',
      cardSplitGroup: halfDeck.Enemy,
    },
    {
      cardType: 'treachery',
      cardSplitGroup: halfDeck.Treachery,
    },
  ];
  forEach(splits, ({ cardSplitGroup, cardType }) => {
    if (cardSplitGroup) {
      const cardIds = filter(cardSplitGroup, c => !limitedSlots || c.limited);
      if (!cardIds.length) {
        return;
      }
      const count = sumBy(cardIds, c => c.quantity);
      const localizedName = sectionHeaderTitle(cardType, count);
      result.push({
        id: `${cardType}-${mode ? `-${mode}` : ''}`,
        subTitle: `— ${localizedName} · ${count} —`,
        cards: map(cardIds, c => {
          return {
            ...c,
            index: index++,
            mode,
            hasUpgrades: hasUpgrades(
              c.id,
              cards,
              cardsByName,
              validation,
              inCollection,
              ignoreCollection
            ),
          };
        }),
      });
    }
  });
  if (result.length) {
    result[0].first = true;
    result[result.length - 1].last = true;
  }
  return [
    { title, onTitlePress, sections: result },
    index,
  ];
}


function bondedSections(
  uniqBondedCards: Card[],
  count: number,
  index: number,
): DeckSection | undefined {
  if (count === 0) {
    return undefined;
  }
  return {
    title: t`Bonded Cards (${count})`,
    sections: [{
      id: 'bonded',
      cards: map(uniqBondedCards, c => {
        return {
          id: c.code,
          quantity: c.quantity || 0,
          index: index++,
          mode: 'bonded',
          bonded: true,
          hasUpgrades: false,
          limited: false,
          invalid: false,
        };
      }),
      last: true,
    }],
  };
}

interface Props {
  componentId: string;
  suggestArkhamDbLogin: boolean;
  deck: Deck;
  deckId: DeckId;
  investigatorFront?: Card;
  investigatorBack?: Card;
  parsedDeck: ParsedDeck;
  hasPendingEdits?: boolean;
  cards: CardsMap;
  cardsByName: {
    [name: string]: Card[];
  };
  bondedCardsByName: {
    [name: string]: Card[];
  };
  visible: boolean;
  editable: boolean;
  buttons?: ReactNode;
  showDrawWeakness: () => void;
  showEditSpecial?: () => void;
  showEditSide?: () => void;
  showXpAdjustmentDialog: () => void;
  showCardUpgradeDialog: (card: Card) => void;
  tabooSet?: TabooSet;
  tabooOpen: boolean;
  singleCardView: boolean;
  tabooSetId?: number;
  showTaboo: boolean;
  signedIn: boolean;
  login: () => void;
  problem?: DeckProblem;
  showEditCards: () => void;
  showDeckHistory: () => void;
  width: number;
  deckEdits?: EditDeckState;
  deckEditsRef: MutableRefObject<EditDeckState | undefined>;
  mode: 'view' | 'edit' | 'upgrade';
}

function getCount(item: SectionCardId, ignoreDeckLimitSlots: Slots | undefined) {
  if (item.mode === 'special') {
    if ((ignoreDeckLimitSlots?.[item.id] || 0) > 0) {
      return ignoreDeckLimitSlots?.[item.id] || 0;
    }
  } else if (item.mode === 'side' || item.mode === 'bonded') {
    return item.quantity;
  }
  return item.quantity - (ignoreDeckLimitSlots?.[item.id] || 0);
}

export default function DeckViewTab(props: Props) {
  const {
    componentId,
    suggestArkhamDbLogin,
    tabooSetId,
    cards,
    deckId,
    investigatorFront,
    investigatorBack,
    deck,
    parsedDeck,
    singleCardView,
    showEditCards,
    showEditSpecial,
    showEditSide,
    cardsByName,
    bondedCardsByName,
    editable,
    showCardUpgradeDialog,
    problem,
    showXpAdjustmentDialog,
    showDrawWeakness,
    visible,
    tabooSet,
    showTaboo,
    tabooOpen,
    buttons,
    showDeckHistory,
    deckEdits,
    deckEditsRef,
    mode,
  } = props;
  const { arkhamDb } = useContext(ArkhamCardsAuthContext);
  const { backgroundStyle, colors, shadow, typography } = useContext(StyleContext);
  const inCollection = useSelector(getPacksInCollection);
  const ignore_collection = useSelector((state: AppState) => !!state.settings.ignore_collection);
  const [limitedSlots, toggleLimitedSlots] = useFlag(false);
  const investigator = useMemo(() => cards[deck.investigator_code], [cards, deck.investigator_code]);
  const [data, setData] = useState<DeckSection[]>([]);

  const [uniqueBondedCards, bondedCardsCount] = useMemo((): [Card[], number] => {
    const bondedCards: Card[] = [];
    forEach(parsedDeck.slots, (count, code) => {
      const card = cards[code];
      if (count > 0 && card) {
        const possibleBondedCards = bondedCardsByName[card.real_name];
        if (possibleBondedCards && possibleBondedCards.length) {
          forEach(possibleBondedCards, bonded => {
            bondedCards.push(bonded);
          });
        }
      }
    });
    if (!bondedCards.length) {
      return [[], 0];
    }
    const uniqueBondedCards = uniqBy(bondedCards, c => c.code);
    const bondedCardsCount = sumBy(uniqueBondedCards, card => card.quantity || 0);
    return [uniqueBondedCards, bondedCardsCount];
  }, [parsedDeck.slots, cards, bondedCardsByName]);
  const limitSlotCount = find(investigatorBack?.deck_options, option => !!option.limit)?.limit || 0;
  useEffect(() => {
    if (!investigatorBack || !visible) {
      return;
    }
    const normalCards = parsedDeck.normalCards;
    const specialCards = parsedDeck.specialCards;
    const sideCards = parsedDeck.sideCards;
    const slots = parsedDeck.slots;
    const validation = new DeckValidation(investigatorBack, slots, deckEdits?.meta);
    const [deckSection, deckIndex] = deckToSections(
      t`Deck Cards`,
      editable ? showEditCards : undefined,
      0,
      normalCards,
      cards,
      cardsByName,
      validation,
      undefined,
      inCollection,
      ignore_collection,
      false
    );
    const [specialSection, specialIndex] = deckToSections(
      t`Special Cards`,
      editable ? showEditSpecial : undefined,
      deckIndex,
      specialCards,
      cards,
      cardsByName,
      validation,
      'special',
      inCollection,
      ignore_collection,
      false
    );
    const newData: DeckSection[] = [deckSection, specialSection];
    if (limitSlotCount > 0) {
      let index = specialIndex;
      const limitedCards: SectionCardId[] = map(filter(flatten([
        ...flatMap(normalCards.Assets || [], cards => cards.data),
        normalCards.Event || [],
        normalCards.Skill || [],
        normalCards.Treachery || [],
        normalCards.Enemy || [],
        ...flatMap(specialCards.Assets || [], cards => cards.data),
      ]), card => card.limited), card => {
        return {
          ...card,
          index: index++,
          mode: undefined,
          hasUpgrades: hasUpgrades(
            card.id,
            cards,
            cardsByName,
            validation,
            inCollection,
            ignore_collection
          ),
        };
      });
      const count = sumBy(limitedCards, card => slots[card.id] || 0);
      newData.push({
        title: t`Limited Slots`,
        toggleCollapsed: toggleLimitedSlots,
        collapsed: !limitedSlots,
        sections: limitedSlots ? [
          {
            id: 'splash',
            title: t`${count} of ${limitSlotCount}`,
            cards: limitedCards,
            last: true,
          },
        ] : [],
      });
    }
    let bondedIndex = specialIndex;
    if (ENABLE_SIDE_DECK) {
      const [sideSection, sideIndex] = deckToSections(
        t`Side Deck`,
        editable ? showEditSide : undefined,
        specialIndex,
        sideCards,
        cards,
        cardsByName,
        validation,
        'side',
        inCollection,
        ignore_collection,
        false
      );
      newData.push(sideSection);
      bondedIndex = sideIndex;
    }
    const bonded = bondedSections(uniqueBondedCards, bondedCardsCount, bondedIndex);
    if (bonded) {
      newData.push(bonded);
    }
    setData(newData);
  }, [investigatorBack, limitSlotCount, ignore_collection, limitedSlots, parsedDeck.normalCards, parsedDeck.specialCards, parsedDeck.slots, parsedDeck.sideCards, deckEdits?.meta, cards,
    showEditCards, showEditSpecial, showEditSide, setData, toggleLimitedSlots, cardsByName, uniqueBondedCards, bondedCardsCount, inCollection, editable, visible]);
  const faction = parsedDeck.investigator.factionCode();
  const showSwipeCard = useCallback((id: string, card: Card) => {
    if (singleCardView) {
      showCard(
        componentId,
        card.code,
        card,
        colors,
        true,
        tabooSetId
      );
      return;
    }
    const index = parseInt(id, 10);
    const visibleCards: Card[] = [];
    const controls: ('deck' | 'side' | 'special' | 'bonded')[] = [];
    forEach(data, deckSection => {
      forEach(deckSection.sections, section => {
        forEach(section.cards, item => {
          const card = cards[item.id];
          if (card) {
            visibleCards.push(card);
            controls.push(item.mode || 'deck');
          }
        });
      });
    });
    showCardSwipe(
      componentId,
      map(visibleCards, card => card.code),
      controls,
      index,
      colors,
      visibleCards,
      false,
      tabooSetId,
      parsedDeck.id,
      investigatorFront
    );
  }, [componentId, data, colors, investigatorFront, tabooSetId, parsedDeck.id, singleCardView, cards]);

  const renderSectionHeader = useCallback((section: CardSection) => {
    if (section.superTitle) {
      return (
        <DeckSectionHeader
          title={section.superTitle}
          onPress={section.onPress}
          faction={faction}
        />
      );
    }
    if (section.title) {
      return (
        <DeckSlotHeader title={section.title} first={section.first} />
      );
    }
    if (section.subTitle) {
      return (
        <DeckBubbleHeader title={section.subTitle} />
      );
    }
    return null;
  }, [faction]);

  const showDeckUpgrades = useMemo(() => {
    return !!(deck.previousDeckId && !deck.nextDeckId);
  }, [deck.previousDeckId, deck.nextDeckId]);

  const controlForCard = useCallback((item: SectionCardId, card: Card, count: number | undefined): ControlType | undefined => {
    if (card.code === RANDOM_BASIC_WEAKNESS && editable) {
      return {
        type: 'shuffle',
        onShufflePress: showDrawWeakness,
      };
    }
    if (mode === 'view' || item.mode === 'bonded') {
      return count !== undefined ? {
        type: 'count',
        count,
      } : undefined;
    }

    const upgradeEnabled = editable && showDeckUpgrades && item.hasUpgrades;
    return {
      type: 'upgrade',
      deckId: parsedDeck.id,
      side: item.mode === 'side',
      limit: card.collectionDeckLimit(inCollection, ignore_collection),
      onUpgradePress: upgradeEnabled ? showCardUpgradeDialog : undefined,
    };
  }, [mode, parsedDeck.id, showCardUpgradeDialog, showDrawWeakness, ignore_collection, editable, showDeckUpgrades, inCollection]);

  const renderCard = useCallback((item: SectionCardId, index: number, section: CardSection) => {
    const card = cards[item.id];
    if (!card) {
      return null;
    }
    const count = getCount(item, deckEditsRef.current?.ignoreDeckLimitSlots);
    return (
      <CardSearchResult
        key={item.index}
        card={card}
        id={`${item.index}`}
        invalid={item.invalid}
        onPressId={showSwipeCard}
        control={controlForCard(item, card, count)}
        faded={count === 0}
        noBorder={section.last && index === (section.cards.length - 1)}
        noSidePadding
      />
    );
  }, [showSwipeCard, deckEditsRef, controlForCard, cards]);

  const dispatch = useDispatch();
  const setTabooSet = useCallback((tabooSetId: number | undefined) => {
    dispatch(setDeckTabooSet(parsedDeck.id, tabooSetId || 0));
  }, [dispatch, parsedDeck.id]);
  const setMeta = useCallback((key: keyof DeckMeta, value?: string) => {
    if (deckEditsRef.current) {
      dispatch(updateDeckMeta(parsedDeck.id, deck.investigator_code, deckEditsRef.current, [{ key, value }]));
    }
  }, [dispatch, parsedDeck.id, deck.investigator_code, deckEditsRef]);
  const setParallel = useCallback((front: string, back: string) => {
    if (deckEditsRef.current) {
      dispatch(updateDeckMeta(parsedDeck.id, deck.investigator_code, deckEditsRef.current, [
        { key: 'alternate_front', value: front },
        { key: 'alternate_back', value: back },
      ]));
    }
  }, [dispatch, deckEditsRef, parsedDeck.id, deck.investigator_code]);
  const [xpLabel, xpDetailLabel] = useDeckXpStrings(parsedDeck);

  const renderXpButton = useCallback((last: boolean) => {
    if (!xpLabel) {
      return null;
    }
    return (
      <DeckPickerStyleButton
        title={t`Upgrade experience`}
        valueLabel={xpLabel}
        valueLabelDescription={xpDetailLabel}
        editable={editable}
        onPress={showXpAdjustmentDialog}
        first
        last={last}
        icon="xp"
      />
    );
  }, [xpLabel, xpDetailLabel, showXpAdjustmentDialog, editable]);
  const investigatorOptions = useMemo(() => {
    if (!deckEdits?.meta || !investigator) {
      return null;
    }
    const hasTabooPicker = (tabooOpen || showTaboo || !!tabooSet);
    const changes = parsedDeck.changes;
    const hasXpButton = editable && !!(changes && deck.previousDeckId);
    return (
      <View style={[styles.optionsContainer, space.paddingS]}>
        <DeckMetadataControls
          tabooOpen={tabooOpen}
          editable={editable}
          tabooSetId={tabooSetId || 0}
          setTabooSet={hasTabooPicker ? setTabooSet : undefined}
          meta={deckEdits.meta}
          investigatorCode={deck?.investigator_code}
          setMeta={setMeta}
          setParallel={setParallel}
          firstElement={hasXpButton && !!changes && !!xpLabel ? renderXpButton : undefined}
          hasPreviousDeck={!!deck.previousDeckId}
        />
      </View>
    );
  }, [investigator, deck, tabooSetId, tabooSet, showTaboo, tabooOpen, editable, deckEdits?.meta, parsedDeck?.changes,
    setMeta, setParallel, setTabooSet, renderXpButton, xpLabel,
  ]);

  const investigatorBlock = useMemo(() => {
    const yithian = parsedDeck.slots && (parsedDeck.slots[BODY_OF_A_YITHIAN] || 0) > 0;
    const investigatorCard = (yithian ? cards[BODY_OF_A_YITHIAN] : undefined) || investigatorFront;

    if (!investigatorCard) {
      return null;
    }
    return (
      <InvestigatorSummaryBlock
        investigator={investigatorCard}
        investigatorBack={investigatorBack}
        yithian={yithian}
        componentId={componentId}
        tabooSetId={tabooSetId}
      />
    );
  }, [componentId, parsedDeck.slots, cards, investigatorFront, investigatorBack, tabooSetId]);

  const header = useMemo(() => {
    return (
      <View style={styles.headerWrapper}>
        <View style={styles.headerBlock}>
          <View style={styles.containerWrapper}>
            <View style={styles.container}>
              { investigatorBlock }
            </View>
            { deckEdits?.mode === 'view' && (
              <DeckMetadataComponent
                parsedDeck={parsedDeck}
                bondedCardCount={bondedCardsCount}
                problem={problem}
              />
            ) }
            { investigatorOptions }
          </View>
          { buttons }
        </View>
      </View>
    );
  }, [investigatorBlock, investigatorOptions, buttons, parsedDeck, bondedCardsCount, problem, deckEdits]);
  if (!deckEdits) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={backgroundStyle}>
      { suggestArkhamDbLogin && (
        <View opacity={0.95} style={[
          styles.banner,
          shadow.large,
          space.paddingVerticalXs,
          space.paddingSideS,
          { backgroundColor: COLORS.red },
        ]}>
          <Text style={[space.paddingS, typography.small, typography.white]}>
            { arkhamDb ?
              t`This appears to be one of your decks from ArkhamDB, however you seem to be logged into a different ArkhamDB account? If you wish to make edits, please login through the app settings.` :
              t`This appears to be one of your decks from ArkhamDB, however you are not currently logged in. If you wish to make edits, please login through the app settings.` }
          </Text>
        </View>
      ) }
      { header }
      <View style={space.marginSideS}>
        { map(data, deckSection => {
          return (
            <View key={deckSection.title} style={space.marginBottomS}>
              <DeckSectionBlock
                faction={faction}
                title={deckSection.title}
                onTitlePress={deckSection.onTitlePress}
                collapsed={deckSection.collapsed}
                toggleCollapsed={deckSection.toggleCollapsed}
                footerButton={deckSection.sections.length === 0 && deckSection.onTitlePress ? (
                  <RoundedFooterButton onPress={deckSection.onTitlePress} title={t`Add cards`} icon="deck" />
                ) : undefined}
              >
                { flatMap(deckSection.sections, section => (
                  <View key={section.id}>
                    { renderSectionHeader(section) }
                    { map(section.cards, (item, index) => renderCard(item, index, section)) }
                  </View>
                )) }
              </DeckSectionBlock>
            </View>
          );
        }) }
        <DeckProgressComponent
          componentId={componentId}
          cards={cards}
          deckId={deckId}
          deck={deck}
          parsedDeck={parsedDeck}
          editable={editable}
          showDeckHistory={showDeckHistory}
          tabooSetId={tabooSetId}
          singleCardView={singleCardView}
        />
      </View>
      <View style={styles.footerPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: '100%',
  },
  headerWrapper: {
    position: 'relative',
  },
  containerWrapper: {
    flexDirection: isBig ? 'row' : 'column',
  },
  container: {
    marginLeft: s,
    marginRight: s,
    flexDirection: 'row',
    flex: 1,
  },
  optionsContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  headerBlock: {
    paddingBottom: s,
    position: 'relative',
  },
  footerPadding: {
    height: FOOTER_HEIGHT,
  },
});
