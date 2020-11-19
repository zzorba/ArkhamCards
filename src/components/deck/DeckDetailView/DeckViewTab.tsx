import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { filter, find, flatMap, flatten, forEach, map, sum, sumBy, uniqBy } from 'lodash';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { t } from 'ttag';

import {
  Campaign,
  CardId,
  Deck,
  DeckMeta,
  DeckProblem,
  ParsedDeck,
  SplitCards,
} from '@actions/types';
import { showCard, showCardSwipe } from '@components/nav/helper';
import CardTabooTextBlock from '@components/card/CardTabooTextBlock';
import InvestigatorImage from '@components/core/InvestigatorImage';
import CardTextComponent from '@components/card/CardTextComponent';
import DeckProgressComponent from '../DeckProgressComponent';
import InvestigatorOptionsModule, { hasInvestigatorOptions } from './InvestigatorOptionsModule';
import { CardSectionHeaderData } from '@components/core/CardSectionHeader';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import InvestigatorStatLine from '@components/core/InvestigatorStatLine';
import HealthSanityLine from '@components/core/HealthSanityLine';
import { BODY_OF_A_YITHIAN } from '@app_constants';
import DeckValidation from '@lib/DeckValidation';
import Card, { CardsMap } from '@data/Card';
import TabooSet from '@data/TabooSet';
import space, { isBig, m, s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useDeckEdits, useFlag } from '@components/core/hooks';
import { setDeckTabooSet, updateDeckMeta } from './actions';
import DeckSlotHeader from '@components/deck/section/DeckSlotHeader';
import DeckBubbleHeader from '@components/deck/section/DeckBubbleHeader';
import DeckSectionHeader from '@components/deck/section/DeckSectionHeader';
import DeckSectionBlock from '@components/deck/section/DeckSectionBlock';
import DeckMetadataComponent from './DeckMetadataComponent';
import DeckTabooPickerButton from './DeckTabooPickerButton';
import RoundedFooterButton from '@components/core/RoundedFooterButton';
import DeckPickerStyleButton from './DeckPickerStyleButton';

interface SectionCardId extends CardId {
  special: boolean;
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
  inCollection: { [pack_code: string]: boolean }
): boolean {
  const card = cards[code];
  return !!(
    card &&
    card.has_upgrades &&
    find(cardsByName[card.real_name] || [], upgradeCard => (
      upgradeCard &&
      upgradeCard.code !== code &&
      validation.canIncludeCard(upgradeCard, false) &&
      (upgradeCard.pack_code === 'core' || inCollection[upgradeCard.pack_code])
    )));
}

function deckToSections(
  title: string,
  onTitlePress: undefined | (() => void),
  index: number,
  halfDeck: SplitCards,
  cards: CardsMap,
  cardsByName: { [name: string]: Card[] },
  validation: DeckValidation,
  special: boolean,
  inCollection: { [pack_code: string]: boolean },
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
      const assets = t`Assets`;
      result.push({
        id: `assets${special ? '-special' : ''}`,
        subTitle: `— ${assets} · ${assetCount} —`,
        cards: [],
      });
    }
    forEach(assets, (subAssets, idx) => {
      result.push({
        id: `asset${special ? '-special' : ''}-${idx}`,
        title: subAssets.type,
        cards: map(subAssets.data, c => {
          return {
            ...c,
            index: index++,
            special,
            hasUpgrades: hasUpgrades(
              c.id,
              cards,
              cardsByName,
              validation,
              inCollection
            ),
          };
        }),
      });
    });
  }
  forEach({
    [t`Event`]: halfDeck.Event,
    [t`Skill`]: halfDeck.Skill,
    [t`Enemy`]: halfDeck.Enemy,
    [t`Treachery`]: halfDeck.Treachery,
  }, (cardSplitGroup, localizedName) => {
    if (cardSplitGroup) {
      const cardIds = filter(cardSplitGroup, c => !limitedSlots || c.limited);
      if (!cardIds.length) {
        return;
      }
      const count = sumBy(cardIds, c => c.quantity);
      result.push({
        id: `${localizedName}-${special ? '-special' : ''}`,
        subTitle: `— ${localizedName} · ${count} —`,
        cards: map(cardIds, c => {
          return {
            ...c,
            index: index++,
            special,
            hasUpgrades: hasUpgrades(
              c.id,
              cards,
              cardsByName,
              validation,
              inCollection
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
          special: true,
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
  deck: Deck;
  investigatorFront?: Card;
  investigatorBack?: Card;
  parallelInvestigators: Card[];
  hideCampaign?: boolean;
  campaign?: Campaign;
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
  isPrivate: boolean;
  buttons?: ReactNode;
  showEditSpecial?: () => void;
  showEditNameDialog: () => void;
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
  showDeckUpgrade: () => void;
  showDeckHistory: () => void;
  width: number;
  inCollection: {
    [pack_code: string]: boolean;
  };
}

export default function DeckViewTab(props: Props) {
  const {
    componentId,
    tabooSetId,
    cards,
    investigatorFront,
    investigatorBack,
    deck,
    parallelInvestigators,
    parsedDeck,
    singleCardView,
    showEditCards,
    showEditSpecial,
    cardsByName,
    bondedCardsByName,
    inCollection,
    editable,
    showCardUpgradeDialog,
    problem,
    showEditNameDialog,
    visible,
    tabooSet,
    showTaboo,
    tabooOpen,
    buttons,
    isPrivate,
    campaign,
    hideCampaign,
    showDeckUpgrade,
    showDeckHistory,
  } = props;
  const { backgroundStyle, colors } = useContext(StyleContext);
  const [deckEdits, deckEditsRef] = useDeckEdits(deck.id);
  const [limitedSlots, toggleLimitedSlots] = useFlag(false);
  const investigator = useMemo(() => cards[deck.investigator_code], [cards, deck.investigator_code]);
  const [data, setData] = useState<DeckSection[]>([]);
  const showInvestigator = useCallback(() => {
    if (investigatorFront) {
      showCard(
        componentId,
        investigatorFront.code,
        investigatorFront,
        colors,
        false,
        tabooSetId,
      );
    }
  }, [componentId, tabooSetId, investigatorFront, colors]);

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
      false,
      inCollection,
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
      true,
      inCollection,
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
          special: false,
          hasUpgrades: hasUpgrades(
            card.id,
            cards,
            cardsByName,
            validation,
            inCollection
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
    const bonded = bondedSections(uniqueBondedCards, bondedCardsCount, specialIndex);
    if (bonded) {
      newData.push(bonded);
    }
    setData(newData);
  }, [investigatorBack, limitSlotCount ,limitedSlots, parsedDeck.normalCards, parsedDeck.specialCards, parsedDeck.slots, deckEdits, cards,
    showEditCards, showEditSpecial, setData, toggleLimitedSlots, cardsByName, uniqueBondedCards, bondedCardsCount, inCollection, editable, visible]);
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
    forEach(data, deckSection => {
      forEach(deckSection.sections, section => {
        forEach(section.cards, item => {
          const card = cards[item.id];
          if (card) {
            visibleCards.push(card);
          }
        });
      });
    });
    showCardSwipe(
      componentId,
      map(visibleCards, card => card.code),
      index,
      colors,
      visibleCards,
      false,
      tabooSetId,
      deck.id,
      investigatorFront
    );
  }, [componentId, data, colors, investigatorFront, tabooSetId, deck.id, singleCardView, cards]);

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
    return !!(deck.previous_deck && !deck.next_deck);
  }, [deck.previous_deck, deck.next_deck]);

  const renderCard = useCallback((item: SectionCardId, index: number, section: CardSection) => {
    const card = cards[item.id];
    if (!card) {
      return null;
    }
    const count = (item.special && (deckEditsRef.current?.ignoreDeckLimitSlots[item.id] || 0) > 0) ?
      deckEditsRef.current?.ignoreDeckLimitSlots[item.id] :
      (item.quantity - (deckEditsRef.current?.ignoreDeckLimitSlots[item.id] || 0));
    const upgradeEnabled = showDeckUpgrades && item.hasUpgrades;
    return (
      <CardSearchResult
        key={item.index}
        card={card}
        id={`${item.index}`}
        invalid={item.invalid}
        onPressId={showSwipeCard}
        control={count !== undefined ? {
          type: 'upgrade',
          count,
          onUpgradePress: upgradeEnabled ? showCardUpgradeDialog : undefined,
        } : undefined}
        noBorder={section.last && index === (section.cards.length - 1)}
      />
    );
  }, [showSwipeCard, deckEditsRef, showDeckUpgrades, showCardUpgradeDialog, cards]);

  const dispatch = useDispatch();
  const setTabooSet = useCallback((tabooSetId: number | undefined) => {
    dispatch(setDeckTabooSet(deck.id, tabooSetId || 0));
  }, [dispatch, deck.id]);
  const setMeta = useCallback((key: keyof DeckMeta, value?: string) => {
    if (deckEditsRef.current) {
      dispatch(updateDeckMeta(deck.id, deck.investigator_code, deckEditsRef.current, [{ key, value }]));
    }
  }, [dispatch, deck.id, deck.investigator_code, deckEditsRef]);
  const setParallel = useCallback((front: string, back: string) => {
    if (deckEditsRef.current) {
      dispatch(updateDeckMeta(deck.id, deck.investigator_code, deckEditsRef.current, [
        { key: 'alternate_front', value: front },
        { key: 'alternate_back', value: back },
      ]));
    }
  }, [dispatch, deckEditsRef, deck.id, deck.investigator_code]);

  const investigatorOptions = useMemo(() => {
    if (!deckEdits?.meta || !investigator) {
      return null;
    }
    const hasTabooPicker = (tabooOpen || showTaboo || !!tabooSet);
    const changes = parsedDeck.changes;
    const hasXpButton = editable && !!(changes && deck.previous_deck);
    const hasOptions = hasInvestigatorOptions(investigator, parallelInvestigators);
    const adjustedXp = (deck.xp || 0) + (deckEdits?.xpAdjustment || 0);
    const unspent = adjustedXp - (changes?.spentXp || 0);
    const unspentStr = unspent > 0 ? `+${unspent}` : `${unspent}`;
    return (
      <View style={[styles.optionsContainer, space.paddingS]}>
        { hasXpButton && !!changes && (
          <DeckPickerStyleButton
            title={t`Experience`}
            valueLabel={t`${adjustedXp} XP`}
            valueLabelDescription={deck.previous_deck ? t`${unspentStr} unspent` : undefined}
            editable={editable}
            onPress={showEditNameDialog}
            first
            last={!hasTabooPicker && !hasOptions}
            icon="xp"
            noLabelDivider
          />
        ) }
        { hasTabooPicker && (
          <DeckTabooPickerButton
            open={tabooOpen}
            faction={investigator.factionCode()}
            disabled={!editable}
            tabooSetId={tabooSetId}
            setTabooSet={setTabooSet}
            first={!hasXpButton}
            last={!hasOptions}
          />
        ) }
        <InvestigatorOptionsModule
          investigator={investigator}
          meta={deckEdits.meta}
          parallelInvestigators={parallelInvestigators}
          setMeta={setMeta}
          setParallel={setParallel}
          editWarning={!!deck.previous_deck}
          disabled={!editable}
          first={!hasTabooPicker && !hasXpButton}
        />
      </View>
    );
  }, [investigator, parallelInvestigators, deck, tabooSetId, tabooSet, showTaboo, tabooOpen, editable,
    deckEdits?.meta, deckEdits?.xpAdjustment, parsedDeck?.changes,
    showEditNameDialog, setMeta, setParallel, setTabooSet,
  ]);

  const investigatorBlock = useMemo(() => {
    const yithian = (parsedDeck.slots[BODY_OF_A_YITHIAN] || 0) > 0;
    const investigatorCard = (yithian ? cards[BODY_OF_A_YITHIAN] : undefined) || investigatorFront;

    if (!investigatorCard) {
      return null;
    }

    return (
      <View style={styles.column}>
        <TouchableOpacity onPress={showInvestigator}>
          <View>
            <View style={styles.header}>
              <View style={styles.headerTextColumn}>
                <InvestigatorStatLine
                  investigator={investigatorCard}
                />
                { !!investigatorCard.text && (
                  <View style={[styles.gameTextBlock, styles.headerLeftMargin]}>
                    <CardTextComponent
                      text={investigatorCard.text}
                    />
                  </View>
                ) }
              </View>
              <View style={[styles.headerColumn, styles.headerLeftMargin]}>
                <View style={styles.image}>
                  <InvestigatorImage
                    card={investigator || investigatorCard}
                    componentId={componentId}
                    yithian={yithian}
                    border
                  />
                </View>
                <HealthSanityLine investigator={investigatorCard} />
              </View>
            </View>
          </View>
          <View style={styles.headerLeftMargin}>
            <CardTabooTextBlock card={investigatorCard} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }, [componentId, parsedDeck.slots, showInvestigator, cards, investigator, investigatorFront]);

  const header = useMemo(() => {
    return (
      <View style={styles.headerWrapper}>
        <View style={styles.headerBlock}>
          <View style={styles.containerWrapper}>
            <View style={styles.container}>
              { investigatorBlock }
            </View>
            <DeckMetadataComponent
              parsedDeck={parsedDeck}
              bondedCardCount={bondedCardsCount}
              problem={problem}
              hasPreviousDeck={!!deck.previous_deck}
              editable={editable}
            />
            { investigatorOptions }
          </View>
          { buttons }
        </View>
      </View>
    );
  }, [investigatorBlock, investigatorOptions, buttons, parsedDeck, bondedCardsCount, problem, editable, deck.previous_deck]);
  if (!deckEdits) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={backgroundStyle}>
      { header }
      <View style={space.marginSideS}>
        { map(data, deckSection => {
          return (
            <View style={space.marginBottomS} key={deckSection.title}>
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
        })}
        <DeckProgressComponent
          componentId={componentId}
          cards={cards}
          deck={deck}
          parsedDeck={parsedDeck}
          editable={editable}
          isPrivate={isPrivate}
          campaign={campaign}
          hideCampaign={hideCampaign}
          showDeckUpgrade={showDeckUpgrade}
          showDeckHistory={showDeckHistory}
          tabooSetId={tabooSetId}
          singleCardView={singleCardView}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerLeftMargin: {
    marginLeft: xs,
  },
  header: {
    marginTop: m,
    marginRight: s,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  headerTextColumn: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  image: {
    marginBottom: xs,
  },
  headerColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: s,
  },
  headerWrapper: {
    position: 'relative',
  },
  column: {
    flex: 1,
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
  gameTextBlock: {
    paddingLeft: xs,
    marginBottom: s,
    marginRight: s,
  },
});
