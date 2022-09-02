import React, { MutableRefObject, useEffect, useMemo, useState, useContext, useCallback } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { flatMap, find, filter, flatten, sumBy, sum, forEach, map, uniqBy } from 'lodash';
import { c, t, msgid } from 'ttag';

import StyleContext from '@styles/StyleContext';
import { ControlType } from '@components/cardlist/CardSearchResult/ControlComponent';
import { showCard, showCardSwipe } from '@components/nav/helper';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import DeckSlotHeader from '@components/deck/section/DeckSlotHeader';
import DeckBubbleHeader from '@components/deck/section/DeckBubbleHeader';
import DeckSectionHeader from '@components/deck/section/DeckSectionHeader';
import LoadingCardSearchResult from '@components/cardlist/LoadingCardSearchResult';
import RoundedFooterButton from '@components/core/RoundedFooterButton';
import DeckSectionBlock from '@components/deck/section/DeckSectionBlock';
import ArkhamLoadingSpinner from '@components/core/ArkhamLoadingSpinner';
import { useFlag, useSettingValue } from '@components/core/hooks';
import { Slots, DeckMeta, CardId, ParsedDeck, SplitCards, EditDeckState } from '@actions/types';
import { TypeCodeType, RANDOM_BASIC_WEAKNESS } from '@app_constants';
import Card, { CardsMap } from '@data/types/Card';
import DeckValidation from '@lib/DeckValidation';
import { CardSectionHeaderData } from '@components/core/CardSectionHeader';
import { getPacksInCollection } from '@reducers';
import space from '@styles/space';
import RoundedFooterDoubleButton from '@components/core/RoundedFooterDoubleButton';
import LanguageContext from '@lib/i18n/LanguageContext';

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
      ((upgradeCard.pack_code === 'core' && !inCollection.no_core) || ignoreCollection || inCollection[upgradeCard.pack_code])
    )));
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
  footer?: React.ReactNode;
  sections: CardSection[];
  toggleCollapsed?: () => void;
  collapsed?: boolean;
}

interface ExtraSection {
  title: string;
  codes: CardId[];
}


function sectionHeaderTitle(type: TypeCodeType | string, count: number): string {
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
    default: return type;
  }
}

function deckToSections(
  title: string,
  onTitlePress: undefined | (() => void),
  footer: React.ReactNode | undefined,
  index: number,
  halfDeck: SplitCards,
  cards: CardsMap,
  cardsByName: undefined | { [name: string]: Card[] },
  validation: DeckValidation,
  mode: 'special' | 'side' | undefined,
  inCollection: { [pack_code: string]: boolean },
  ignoreCollection: boolean,
  limitedSlots: boolean,
  limitedSlotsOnly?: boolean,
  extraSections?: ExtraSection[]
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
            hasUpgrades: !!cardsByName && hasUpgrades(
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
  const splits: { cardType: string; cardSplitGroup?: CardId[] }[] = [
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
  forEach(extraSections, ({ title, codes }) => {
    if (codes.length) {
      splits.push({
        cardType: title,
        cardSplitGroup: codes,
      });
    }
  });

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
            hasUpgrades: !!cardsByName && hasUpgrades(
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
    { title, footer, onTitlePress, sections: result },
    index,
  ];
}

function bondedSections(
  uniqBondedCards: Card[],
  count: number,
  index: number,
): [DeckSection | undefined, number] {
  if (count === 0) {
    return [undefined, index];
  }
  const sections: CardSection[] = [{
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
  }];
  return [{
    title: t`Bonded Cards (${count})`,
    sections,
  }, index];
}


interface Props {
  parsedDeck: ParsedDeck | undefined;

  visible: boolean;
  cards: CardsMap;
  meta: DeckMeta | undefined;
  componentId: string;
  tabooSetId: number | undefined;
  mode: 'view' | 'edit' | 'upgrade';

  editable?: boolean;
  showDraftCards?: () => void;
  showEditCards?: () => void;
  showEditSpecial?: () => void;
  showEditSide?: () => void;
  showDrawWeakness?: (replaceRandomBasicWeakness?: boolean) => void;
  showCardUpgradeDialog?: (card: Card) => void;
  deckEditsRef?: MutableRefObject<EditDeckState | undefined>;

  requiredCards?: CardId[];
  cardsByName?: {
    [name: string]: Card[];
  };

  bondedCardsByName?: {
    [name: string]: Card[];
  };
}


export default function useParsedDeckComponent({
  deckEditsRef, componentId, tabooSetId, parsedDeck, cardsByName,
  mode, editable, bondedCardsByName, cards, visible, meta, requiredCards,
  showDrawWeakness, showEditSpecial, showEditCards, showEditSide, showCardUpgradeDialog, showDraftCards,
}: Props): [React.ReactNode, number] {
  const inCollection = useSelector(getPacksInCollection);
  const ignore_collection = useSettingValue('ignore_collection');
  const [limitedSlots, toggleLimitedSlots] = useFlag(false);
  const investigatorFront = parsedDeck?.investigatorFront;

  const slots = parsedDeck?.slots;
  const investigatorBack = parsedDeck?.investigatorBack;
  const [uniqueBondedCards, bondedCardsCount] = useMemo((): [Card[], number] => {
    if (!slots) {
      return [[], 0];
    }
    const bondedCards: Card[] = [];
    forEach(slots, (count, code) => {
      const card = cards[code];
      if (count > 0 && card) {
        const possibleBondedCards = bondedCardsByName?.[card.real_name];
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
  }, [slots, cards, bondedCardsByName]);
  const limitSlotCount = useMemo(() => find(investigatorBack?.deck_options, option => !!option.limit)?.limit || 0, [investigatorBack]);
  const [data, setData] = useState<DeckSection[]>([]);
  useEffect(() => {
    if (!parsedDeck?.investigatorBack || !visible) {
      return;
    }
    const normalCards = parsedDeck.normalCards;
    const specialCards = parsedDeck.specialCards;
    const sideCards = parsedDeck.sideCards;
    const slots = parsedDeck.slots;
    const validation = new DeckValidation(parsedDeck.investigatorBack, slots, meta);
    const shouldDraft = !parsedDeck.changes && !!showDraftCards;
    const hasNormalCards = (!!normalCards.Assets?.length ||
      !!normalCards.Enemy?.length ||
      !!normalCards.Event?.length ||
      !!normalCards.Skill?.length ||
      !!normalCards.Treachery?.length
    );
    const [deckSection, deckIndex] = deckToSections(
      t`Deck Cards`,
      showEditCards,
      shouldDraft ? (
        <RoundedFooterDoubleButton
          onPressA={showEditCards}
          titleA={t`Add cards`}
          iconA="addcard"
          onPressB={showDraftCards}
          titleB={t`Draft cards`}
          iconB="draft"
        />
      ) : (
        !hasNormalCards && (
          <RoundedFooterButton
            title={t`Add cards`}
            icon="addcard"
            onPress={showEditCards}
          />
        )
      ),
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
      showEditSpecial,
      undefined,
      deckIndex,
      specialCards,
      cards,
      cardsByName,
      validation,
      'special',
      inCollection,
      ignore_collection,
      false,
      undefined,
      requiredCards && [{
        title: t`Other investigator cards`,
        codes: requiredCards,
      }]
    );
    const newData: DeckSection[] = [deckSection, specialSection];
    let currentIndex = specialIndex;
    const [bonded, bondedIndex] = bondedSections(uniqueBondedCards, bondedCardsCount, currentIndex);
    if (bonded) {
      newData.push(bonded);
      currentIndex = bondedIndex;
    }
    if (limitSlotCount > 0) {
      let index = currentIndex;
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
          hasUpgrades: !!cardsByName && hasUpgrades(
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
      if (count > 0) {
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
        if (limitedSlots) {
          currentIndex = index;
        }
      }
    }
    const [sideSection, sideIndex] = deckToSections(
      t`Side Deck`,
      showEditSide,
      <RoundedFooterButton
        title={t`Add cards`}
        icon="addcard"
        onPress={showEditSide}
      />,
      currentIndex,
      sideCards,
      cards,
      cardsByName,
      validation,
      'side',
      inCollection,
      ignore_collection,
      false
    );
    if (editable || sideSection.sections.length) {
      newData.push(sideSection);
    }
    currentIndex = sideIndex;
    setData(newData);
  }, [requiredCards, limitSlotCount, ignore_collection, limitedSlots, parsedDeck, meta, cards,
    showDraftCards, showEditCards, showEditSpecial, showEditSide, setData, toggleLimitedSlots, cardsByName, uniqueBondedCards, bondedCardsCount, inCollection, editable, visible]);

  const faction = parsedDeck?.investigator.factionCode() || 'neutral';
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
  const deckId = parsedDeck?.id;
  const controlForCard = useCallback((item: SectionCardId, card: Card, count: number | undefined): ControlType | undefined => {
    if (card.code === RANDOM_BASIC_WEAKNESS && editable && showDrawWeakness) {
      return {
        type: 'shuffle',
        onShufflePress: () => showDrawWeakness(true),
      };
    }
    if (mode === 'view' || item.mode === 'bonded') {
      return count !== undefined ? {
        type: 'count',
        count,
      } : undefined;
    }
    if (!deckId) {
      return undefined;
    }

    const upgradeEnabled = editable && item.hasUpgrades;
    return {
      type: 'upgrade',
      deckId: deckId,
      side: item.mode === 'side',
      editable: !!editable,
      limit: card.collectionDeckLimit(inCollection, ignore_collection),
      onUpgradePress: upgradeEnabled ? showCardUpgradeDialog : undefined,
    };
  }, [mode, deckId, showCardUpgradeDialog, showDrawWeakness, ignore_collection, editable, inCollection]);
  const singleCardView = useSettingValue('single_card');
  const { colors } = useContext(StyleContext);
  const customizations = parsedDeck?.customizations;
  const showSwipeCard = useCallback((id: string, card: Card) => {
    if (singleCardView) {
      showCard(
        componentId,
        card.code,
        card,
        colors,
        true,
        deckId,
        customizations,
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
      deckId,
      investigatorFront,
      editable,
      customizations,
    );
  }, [componentId, customizations, data, editable, colors, deckId, investigatorFront, tabooSetId, singleCardView, cards]);
  const { listSeperator } = useContext(LanguageContext);
  const renderCard = useCallback((item: SectionCardId, index: number, section: CardSection, isLoading: boolean) => {
    const card = cards[item.id];
    if (!card) {
      return null;
    }
    const count = getCount(item, deckEditsRef?.current?.ignoreDeckLimitSlots);
    const cardCustomizations = customizations?.[card.code];
    return (
      <CardSearchResult
        key={item.index}
        card={card.withCustomizations(listSeperator, cardCustomizations, 'parsedDeck')}
        id={`${item.index}`}
        invalid={item.invalid}
        onPressId={showSwipeCard}
        control={controlForCard(item, card, count)}
        faded={count === 0}
        noBorder={!isLoading && section.last && index === (section.cards.length - 1)}
        noSidePadding
      />
    );
  }, [listSeperator, showSwipeCard, deckEditsRef, controlForCard, cards, customizations]);

  if (!data || !data.length) {
    return [<ArkhamLoadingSpinner key="loader" autoPlay loop />, bondedCardsCount];
  }
  return [(
    <>
      { map(data, deckSection => {
        const isLoading = (!!find(deckSection.sections, section => find(section.cards, item => !cards[item.id])));
        return (
          <View key={deckSection.title} style={space.marginBottomS}>
            <DeckSectionBlock
              faction={faction}
              title={deckSection.title}
              onTitlePress={editable ? deckSection.onTitlePress : undefined}
              collapsed={deckSection.collapsed}
              toggleCollapsed={deckSection.toggleCollapsed}
              collapsedText={deckSection.collapsed ? t`Show splash cards` : t`Hide splash cards`}
              footerButton={editable ? deckSection.footer : undefined}
            >
              { flatMap(deckSection.sections, section => (
                <View key={section.id}>
                  { renderSectionHeader(section) }
                  { map(section.cards, (item, index) => renderCard(item, index, section, isLoading)) }
                </View>
              )) }
              { isLoading && (
                <LoadingCardSearchResult noBorder />
              ) }
            </DeckSectionBlock>
          </View>
        );
      }) }
    </>
  ), bondedCardsCount];
}