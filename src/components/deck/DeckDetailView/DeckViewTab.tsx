import React, { ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { filter, find, flatMap, forEach, map, sum, sumBy, uniqBy } from 'lodash';
import {
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { t } from 'ttag';

import PickerStyleButton from '@components/core/PickerStyleButton';
import {
  Campaign,
  CardId,
  Deck,
  DeckMeta,
  DeckProblem,
  InvestigatorData,
  ParsedDeck,
  SplitCards,
  Slots,
  Trauma,
} from '@actions/types';
import { showCard, showCardSwipe } from '@components/nav/helper';
import DeckProblemRow from '@components/core/DeckProblemRow';
import CardTabooTextBlock from '@components/card/CardTabooTextBlock';
import InvestigatorImage from '@components/core/InvestigatorImage';
import CardTextComponent from '@components/card/CardTextComponent';
import DeckProgressComponent from '../DeckProgressComponent';
import InvestigatorOptionsModule from './InvestigatorOptionsModule';
import CardSectionHeader, { CardSectionHeaderData } from '@components/core/CardSectionHeader';
import TabooSetPicker from '@components/core/TabooSetPicker';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import InvestigatorStatLine from '@components/core/InvestigatorStatLine';
import HealthSanityLine from '@components/core/HealthSanityLine';
import { BODY_OF_A_YITHIAN } from '@app_constants';
import DeckValidation from '@lib/DeckValidation';
import Card, { CardsMap } from '@data/Card';
import TabooSet from '@data/TabooSet';
import COLORS from '@styles/colors';
import { isBig, m, s, xs } from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import { useCards } from '@components/core/hooks';
import { parse } from 'url';

interface SectionCardId extends CardId {
  special: boolean;
  hasUpgrades: boolean;
}

interface CardSection extends CardSectionHeaderData {
  id: string;
  data: SectionCardId[];
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
  halfDeck: SplitCards,
  cards: CardsMap,
  cardsByName: { [name: string]: Card[] },
  validation: DeckValidation,
  special: boolean,
  inCollection: { [pack_code: string]: boolean },
  limitedSlots: boolean
): CardSection[] {
  const result: CardSection[] = [];
  if (halfDeck.Assets) {
    const assets = flatMap(halfDeck.Assets, subAssets => {
      const data = filter(subAssets.data, c => !limitedSlots || c.limited);
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
      result.push({
        id: `assets${special ? '-special' : ''}`,
        subTitle: t`Assets (${assetCount})`,
        data: [],
      });
    }
    forEach(assets, (subAssets, idx) => {
      result.push({
        id: `asset${special ? '-special' : ''}-${idx}`,
        title: subAssets.type,
        data: map(subAssets.data, c => {
          return {
            ...c,
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
        subTitle: `${localizedName} (${count})`,
        data: map(cardIds, c => {
          return {
            ...c,
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
  if (!special && result.length === 0) {
    result.push({
      id: 'cards-placeholder',
      placeholder: true,
      data: [],
    });
  }
  return result;
}


function bondedSections(
  slots: Slots,
  cards: CardsMap,
  bondedCardsByName: { [name: string]: Card[] }
): CardSection[] {
  const bondedCards: Card[] = [];
  forEach(slots, (count, code) => {
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
    return [];
  }
  const uniqBondedCards = uniqBy(bondedCards, c => c.code);
  const count = sumBy(uniqBondedCards, card => card.quantity || 0);
  return [{
    id: 'bonded-cards',
    title: t`Bonded Cards (${count})`,
    data: map(uniqBondedCards, c => {
      return {
        id: c.code,
        quantity: c.quantity || 0,
        special: true,
        hasUpgrades: false,
        limited: false,
        invalid: false,
      };
    }),
  }];
}

interface Props {
  componentId: string;
  deck: Deck;
  parallelInvestigators: Card[];
  hideCampaign?: boolean;
  campaign?: Campaign;
  parsedDeck: ParsedDeck;
  meta: DeckMeta;
  hasPendingEdits?: boolean;
  cards: CardsMap;
  cardsByName: {
    [name: string]: Card[];
  };
  bondedCardsByName: {
    [name: string]: Card[];
  };
  editable: boolean;
  isPrivate: boolean;
  buttons?: ReactNode;
  showEditSpecial?: () => void;
  showEditNameDialog: () => void;
  showTraumaDialog: (investigator: Card, traumaData: Trauma) => void;
  showCardUpgradeDialog: (card: Card) => void;
  investigatorDataUpdates?: InvestigatorData;
  deckName: string;
  tabooSet?: TabooSet;
  tabooOpen: boolean;
  singleCardView: boolean;
  tabooSetId?: number;
  showTaboo: boolean;
  setTabooSet: (tabooSetId?: number) => void;
  xpAdjustment: number;
  signedIn: boolean;
  login: () => void;
  problem?: DeckProblem;
  renderFooter: (slots?: Slots) => React.ReactNode;
  onDeckCountChange: (code: string, count: number) => void;
  setMeta: (key: keyof DeckMeta, value?: string) => void;
  showEditCards: () => void;
  showDeckUpgrade: () => void;
  showDeckHistory: () => void;
  width: number;
  inCollection: {
    [pack_code: string]: boolean;
  };
}

interface State {
  limitedSlots: boolean;
}

function keyForCard(item: SectionCardId) {
  return item.id;
}

export default function DeckViewTab({
  componentId,
  tabooSetId,
  cards,
  deck,
  meta,
  parallelInvestigators,
  parsedDeck,
  renderFooter,
  onDeckCountChange,
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
  xpAdjustment,
  setMeta,
  tabooSet,
  setTabooSet,
  showTaboo,
  tabooOpen,
  buttons,
  isPrivate,
  campaign,
  hideCampaign,
  showTraumaDialog,
  showDeckUpgrade,
  showDeckHistory,
  investigatorDataUpdates,
}: Props) {
  const { colors, typography } = useContext(StyleContext);
  const [limitedSlots, setLimitedSlots] = useState(false);
  const investigator = useMemo(() => cards[deck.investigator_code], [cards, deck.investigator_code]);

  const investigatorFront = useMemo(() => {
    const altFront = meta.alternate_front && find(
      parallelInvestigators,
      card => card.code === meta.alternate_front);
    return altFront || cards[deck.investigator_code];
  }, [deck, cards, meta, parallelInvestigators]);

  const investigatorBack = useMemo(() => {
    const investigator = parsedDeck.investigator;
    const altFront = meta.alternate_back && find(
      parallelInvestigators,
      card => card.code === meta.alternate_back);
    return altFront || investigator;
  }, [parsedDeck.investigator, meta, parallelInvestigators]);

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

  const data = useMemo((): CardSection[] => {
    const {
      normalCards,
      specialCards,
      slots,
    } = parsedDeck;
    const validation = new DeckValidation(investigatorBack, slots, meta);
    return [
      {
        id: 'cards',
        superTitle: t`Deck Cards`,
        data: [],
        onPress: editable ? showEditCards : undefined,
      },
      ...deckToSections(
        normalCards,
        cards,
        cardsByName,
        validation,
        false,
        inCollection,
        limitedSlots
      ), {
        id: 'special',
        superTitle: t`Special Cards`,
        data: [],
        onPress: showEditSpecial,
      },
      ...deckToSections(
        specialCards,
        cards,
        cardsByName,
        validation,
        true,
        inCollection,
        limitedSlots
      ),
      ...(limitedSlots ? [] : bondedSections(slots, cards, bondedCardsByName)),
    ];
  }, [
    limitedSlots,
    parsedDeck.normalCards,
    parsedDeck.specialCards,
    parsedDeck.slots,
    meta,
    cards,
    showEditCards,
    showEditSpecial,
    cardsByName,
    bondedCardsByName,
    inCollection,
    editable,
  ]);

  const showSwipeCard = useCallback((id: string, card: Card) => {
    const slots = parsedDeck.slots;
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
    const [sectionId, cardIndex] = id.split('.');
    let index = 0;
    const visibleCards: Card[] = [];
    forEach(data, section => {
      if (sectionId === section.id) {
        index = visibleCards.length + parseInt(cardIndex, 10);
      }
      forEach(section.data, item => {
        const card = cards[item.id];
        if (card) {
          visibleCards.push(card);
        }
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
      slots,
      onDeckCountChange,
      investigatorFront,
      renderFooter
    );
  }, [componentId, data, tabooSetId, parsedDeck.slots, renderFooter, onDeckCountChange, singleCardView, cards]);

  const renderSectionHeader = useCallback(({ section }: { section: SectionListData<SectionCardId> }) => {
    return (
      <CardSectionHeader
        key={section.id}
        section={section as CardSectionHeaderData}
        investigator={parsedDeck.investigator}
      />
    );
  }, [parsedDeck.investigator]);

  const renderCard = useCallback(({ item, index, section }: SectionListRenderItemInfo<SectionCardId>) => {
    const {
      ignoreDeckLimitSlots,
      deck: {
        previous_deck,
        next_deck,
      },
    } = parsedDeck;
    const card = cards[item.id];
    if (!card) {
      return null;
    }
    const count = (item.special && ignoreDeckLimitSlots[item.id] > 0) ?
      ignoreDeckLimitSlots[item.id] :
      (item.quantity - (ignoreDeckLimitSlots[item.id] || 0));
    const id = `${section.id}.${index}`;
    const upgradeEnabled = previous_deck && !next_deck && item.hasUpgrades;
    return (
      <CardSearchResult
        key={id}
        card={card}
        id={id}
        invalid={item.invalid}
        onUpgrade={upgradeEnabled ? showCardUpgradeDialog : undefined}
        onPressId={showSwipeCard}
        count={count}
      />
    );
  }, [showSwipeCard, parsedDeck.ignoreDeckLimitSlots, parsedDeck.deck.previous_deck, parsedDeck.deck.next_deck, showCardUpgradeDialog, cards]);

  const problemHeader = useMemo(() => {
    if (!problem) {
      return null;
    }
    const isSurvivor = parsedDeck.investigator.faction_code === 'survivor';
    return (
      <View style={[styles.problemBox,
        { backgroundColor: isSurvivor ? COLORS.yellow : COLORS.red },
      ]}>
        <DeckProblemRow
          problem={problem}
          color={isSurvivor ? COLORS.black : COLORS.white}
          fontSize={14}
        />
      </View>
    );
  }, [parsedDeck.investigator, problem]);

  const availableExperienceButton = useMemo(() => {
    const { changes } = parsedDeck;
    if (!changes) {
      return null;
    }
    const adjustedXp = (deck.xp || 0) + xpAdjustment;
    return (
      <PickerStyleButton
        id="xp"
        title={t`Experience`}
        value={t`${changes.spentXp} of ${adjustedXp}`}
        disabled={!editable}
        onPress={showEditNameDialog}
        colors={{
          backgroundColor: 'transparent',
          textColor: colors.darkText,
        }}
        widget="nav"
        noBorder
        settingsStyle
      />
    );
  }, [colors, parsedDeck.changes, deck, showEditNameDialog, xpAdjustment, editable]);

  const toggleLimitedSlots = useCallback(() => {
    setLimitedSlots(!limitedSlots);
  }, [limitedSlots, setLimitedSlots]);

  const investigatorOptions = useMemo(() => {
    return (
      <View style={styles.optionsContainer}>
        { (tabooOpen || showTaboo || !!tabooSet) && (
          <TabooSetPicker
            open={tabooOpen}
            disabled={!editable}
            tabooSetId={tabooSetId}
            setTabooSet={setTabooSet}
            color={colors.faction[
              investigator ? investigator.factionCode() : 'neutral'
            ].darkBackground}
            transparent
          />
        ) }
        <InvestigatorOptionsModule
          investigator={parsedDeck.investigator}
          meta={meta}
          parallelInvestigators={parallelInvestigators}
          setMeta={setMeta}
          editWarning={!!deck.previous_deck}
          disabled={!editable}
        />
        { availableExperienceButton }
        { limitedSlots && (
          <View style={styles.toggleRow}>
            <Text style={[
              typography.text,
            ]}>
              { t`Show limited splash` }
            </Text>
            <ArkhamSwitch
              value={limitedSlots}
              onValueChange={toggleLimitedSlots}
            />
          </View>
        ) }
      </View>
    );
  }, [
    colors,
    availableExperienceButton,
    limitedSlots,
    toggleLimitedSlots,
    typography,
    parsedDeck.investigator,
    parsedDeck.limitedSlots,
    parallelInvestigators,
    deck,
    meta,
    tabooSetId,
    setMeta,
    tabooSet,
    setTabooSet,
    showTaboo,
    tabooOpen,
    editable,
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
  }, [componentId, parsedDeck.slots, cards, investigator, investigatorFront]);

  const header = useMemo(() => {
    return (
      <View style={styles.headerWrapper}>
        <View style={styles.headerBlock}>
          { problemHeader }
          <View style={styles.containerWrapper}>
            <View style={styles.container}>
              { investigatorBlock }
            </View>
            { investigatorOptions }
          </View>
          { buttons }
        </View>
      </View>
    );
  }, [problemHeader, investigatorBlock, investigatorOptions, buttons]);

  return (
    <SectionList
      ListHeaderComponent={header}
      ListFooterComponent={(
        <DeckProgressComponent
          componentId={componentId}
          cards={cards}
          deck={deck}
          parsedDeck={parsedDeck}
          editable={editable}
          isPrivate={isPrivate}
          campaign={campaign}
          hideCampaign={hideCampaign}
          showTraumaDialog={showTraumaDialog}
          showDeckUpgrade={showDeckUpgrade}
          showDeckHistory={showDeckHistory}
          investigatorDataUpdates={investigatorDataUpdates}
          xpAdjustment={xpAdjustment}
          tabooSetId={tabooSetId}
          renderFooter={renderFooter}
          onDeckCountChange={onDeckCountChange}
          singleCardView={singleCardView}
        />
      )}
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag"
      initialNumToRender={50}
      renderItem={renderCard}
      keyExtractor={keyForCard}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={renderSectionHeader}
      sections={data}
    />
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
  problemBox: {
    flex: 1,
    paddingTop: xs,
    paddingBottom: xs,
    paddingRight: s,
    paddingLeft: s,
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
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s,
    paddingLeft: m,
    paddingRight: m,
  },
});
