import React, { MutableRefObject, useEffect, useMemo, useState, useContext, useCallback } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { flatMap, find, filter, flatten, keys, range, sumBy, sum, forEach, map, uniqBy } from 'lodash';
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
import { DeckMeta, CardId, ParsedDeck, SplitCards, EditDeckState, Customizations, Slots, AttachableDefinition } from '@actions/types';
import { TypeCodeType, RANDOM_BASIC_WEAKNESS, getAttachableCards } from '@app_constants';
import Card, { CardsMap, InvestigatorChoice, cardInCollection } from '@data/types/Card';
import DeckValidation from '@lib/DeckValidation';
import { CardSectionHeaderData } from '@components/core/CardSectionHeader';
import { getPacksInCollection, getShowCustomContent } from '@reducers';
import space from '@styles/space';
import RoundedFooterDoubleButton from '@components/core/RoundedFooterDoubleButton';
import LanguageContext from '@lib/i18n/LanguageContext';
import { useDeckAttachmentSlots, xpString } from './hooks';
import { BONDED_WEAKNESS_COUNTS, THE_INSANE_CODE } from '@data/deck/specialCards';
import { PARALLEL_JIM_CODE } from '@data/deck/specialMetaSlots';

interface CollectionSettings {
  inCollection: { [pack_code: string]: boolean };
  ignoreCollection: boolean;
  limitedSlots?: boolean;
  showCustomContent: boolean;
}
function hasUpgrades(
  code: string,
  deckCards: Card[],
  cards: CardsMap,
  cardsByName: { [name: string]: Card[] },
  validation: DeckValidation,
  { inCollection, ignoreCollection, showCustomContent }: CollectionSettings,
  isArkhamDbDeck: boolean
): boolean {
  const card = cards[code];
  return !!(
    card &&
    card.has_upgrades &&
    find(cardsByName[card.real_name.toLowerCase()] || [], upgradeCard => (
      upgradeCard &&
      upgradeCard.code !== code &&
      (upgradeCard.xp || 0) > (card.xp || 0) &&
      (isArkhamDbDeck ? !card.custom() : (showCustomContent || !card.custom())) &&
      validation.canIncludeCard(upgradeCard, false, deckCards) &&
      ((upgradeCard.pack_code === 'core' && !inCollection.no_core) || ignoreCollection || cardInCollection(upgradeCard, inCollection))
    )));
}

function hasCustomizationUpgrades(
  code: string,
  deckCards: Card[],
  cards: CardsMap,
  customizations: Customizations | undefined,
  validation: DeckValidation
) {
  const card = cards[code];
  return !!(
    card &&
    card.customization_options &&
    validation.canIncludeCard(
      card.withCustomizations(',', customizations?.[code], 1),
      false,
      deckCards
    )
  );
}

function getCount(item: SectionCardId): [number, 'side' | 'extra' | 'ignore' | undefined] {
  if (item.ignoreCount) {
    return [item.quantity, 'ignore'];
  }
  if (item.mode === 'side') {
    return [item.quantity, 'side'];
  }
  if (item.mode === 'extra') {
    return [item.quantity, 'extra'];
  }
  return [
    item.quantity,
    undefined,
  ];
}


interface SectionCardId extends CardId {
  mode: 'special' | 'extra' | 'side' | 'bonded' | 'attachment' | 'ignore' | undefined;
  hasUpgrades: boolean;
  customizable: boolean;
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
    case 'enemy_location': return c('header').ngettext(msgid`Enemy-Location`, `Enemy-Locations`, count);
    case 'location': return c('header').ngettext(msgid`Location`, `Locations`, count);
    case 'story': return c('header').ngettext(msgid`Story`, `Stories`, count);
    case 'act': return c('header').ngettext(msgid`Act`, `Acts`, count);
    case 'agenda': return c('header').ngettext(msgid`Agenda`, `Agendas`, count);
    case 'investigator': return c('header').ngettext(msgid`Investigator`, `Investigators`, count);
    case 'scenario': return c('header').ngettext(msgid`Scenario`, `Scenarios`, count);
    case 'key': return c('header').ngettext(msgid`Key`, `Keys`, count);
    default: return type;
  }
}

function deckToSections(
  title: string,
  onTitlePress: undefined | (() => void),
  footer: React.ReactNode | undefined,
  index: number,
  halfDeck: SplitCards,
  deckCards: Card[],
  cards: CardsMap,
  cardsByName: undefined | { [name: string]: Card[] },
  validation: DeckValidation,
  customizations: Customizations | undefined,
  mode: 'special' | 'side' | 'extra' | undefined,
  settings: CollectionSettings,
  isArkhamDbDeck: boolean,
  options?: {
    limitedSlotsOnly?: boolean;
    extraSections?: ExtraSection[];
    sumXp?: boolean;
    existingSlots?: Slots;
  }
): [DeckSection, number] {
  const { limitedSlots } = settings;
  const { limitedSlotsOnly, extraSections, sumXp, existingSlots } = options || {};
  const result: CardSection[] = [];

  function calculateSideDeckXp(cardIds: CardId[]) {
    return sumBy(cardIds, cardId => {
      const card = cards[cardId.id];
      if (!card) {
        return 0;
      }

      let existingXp = 0;
      if (cardsByName && existingSlots) {
        const byName = cardsByName[card.real_name.toLowerCase()] || [];
        forEach(byName, otherCard => {
          const count = existingSlots[otherCard.code];
          if (count > 0) {
            existingXp += count * ((otherCard?.xp ?? 0) * (otherCard?.exceptional ? 2 : 1) + (card?.extra_xp ?? 0));
          }
        });
      }
      return cardId.quantity * ((card?.xp ?? 0) * (card?.exceptional ? 2 : 1) + (card?.extra_xp ?? 0)) - existingXp;
    });
  }
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
    const xp = xpString(sumXp ? sumBy(assets, subAssets => calculateSideDeckXp(subAssets.data)) : 0);
    if (assetCount > 0) {
      const assets = sectionHeaderTitle('asset', assetCount);
      result.push({
        id: `assets${mode ? `-${mode}` : ''}`,
        subTitle: sumXp ? `— ${assets} · ${assetCount} · ${xp} —` : `— ${assets} · ${assetCount} —`,
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
            mode: mode === 'special' && c.ignoreCount ? 'ignore' : mode,
            hasUpgrades: !!cardsByName && hasUpgrades(
              c.id,
              deckCards,
              cards,
              cardsByName,
              validation,
              settings,
              isArkhamDbDeck,
            ),
            customizable: hasCustomizationUpgrades(c.id, deckCards, cards, customizations, validation),
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
      const xp = xpString(sumXp ? calculateSideDeckXp(cardIds) : 0);
      result.push({
        id: `${cardType}-${mode ? `-${mode}` : ''}`,
        subTitle: sumXp ? `— ${localizedName} · ${count} · ${xp} —` : `— ${localizedName} · ${count} —`,
        cards: map(cardIds, c => {
          return {
            ...c,
            index: index++,
            mode: mode === 'special' && c.ignoreCount ? 'ignore' : mode,
            hasUpgrades: !!cardsByName && hasUpgrades(
              c.id,
              deckCards,
              cards,
              cardsByName,
              validation,
              settings,
              isArkhamDbDeck,
            ),
            customizable: hasCustomizationUpgrades(c.id, deckCards, cards, customizations, validation),
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

function attachmentSection(
  attachment: AttachableDefinition,
  slots: Slots,
  cards: Card[],
  attachmentSlots: Slots,
  index: number,
): [DeckSection | undefined, number] {
  if (!cards.length) {
    return [undefined, index];
  }
  const total = sumBy(cards, c => attachment.requiredCards?.[c.code] ?? attachmentSlots[c.code] ?? 0);
  const sections: CardSection[] = [{
    id: `attachment_${attachment.code}`,
    cards: map(cards, c => {
      return {
        id: c.code,
        quantity: slots[c.code] ?? 0,
        index: index++,
        mode: 'attachment',
        bonded: true,
        hasUpgrades: false,
        limited: false,
        invalid: false,
        customizable: false,
      };
    }),
    last: true,
  }];
  return [{
    title: `${attachment.name} (${total} / ${attachment.targetSize})`,
    sections,
  }, index];
}

function bondedSections(
  uniqBondedCards: Card[],
  counts: Slots,
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
        quantity: counts[c.code] ?? 0,
        index: index++,
        mode: 'bonded',
        bonded: true,
        hasUpgrades: false,
        limited: false,
        invalid: false,
        customizable: false,
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
  showDraftExtraCards?: () => void;
  showEditCards?: () => void;
  showEditSpecial?: () => void;
  showEditSide?: () => void;
  showEditExtra?: () => void;
  showDrawWeakness?: (replaceRandomBasicWeakness?: boolean) => void;
  showCardUpgradeDialog?: (card: Card, mode: 'extra' | undefined) => void;
  deckEditsRef?: MutableRefObject<EditDeckState | undefined>;

  requiredCards?: CardId[];
  cardsByName?: {
    [name: string]: Card[];
  };

  bondedCardsByName?: {
    [name: string]: Card[];
  };
}
export function useAttachableCards() {
  const { lang } = useContext(LanguageContext);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => getAttachableCards(), [lang]);
}
export function useDeckAttachments(
  investigator: InvestigatorChoice | undefined,
  slots: Slots | undefined
): [(card: Card) => AttachableDefinition[], AttachableDefinition | undefined] {
  const attachableCards = useAttachableCards();
  const attachables = useMemo(() => {
    return filter(Object.values(attachableCards), attachment => {
      return attachment.code === investigator?.main.code || !!slots?.[attachment.code];
    });
  }, [attachableCards, investigator, slots]);

  const forCard = useCallback((card: Card) => {
    return attachables.filter(attachment =>
      (attachment.requiredCards?.[card.code] ?? 0) > 0 ||
      !!attachment.traits?.find(trait => card.real_traits_normalized?.indexOf(`#${trait}#`) !== -1)
    );
  }, [attachables]);

  return [forCard, investigator?.main ? attachableCards[investigator.main.code] : undefined];
}

export default function useParsedDeckComponent({
  componentId, tabooSetId, parsedDeck, cardsByName,
  mode, editable, bondedCardsByName, cards, visible, meta, requiredCards,
  showDrawWeakness, showEditSpecial, showEditCards, showEditExtra, showEditSide, showCardUpgradeDialog, showDraftCards, showDraftExtraCards,
}: Props): [React.ReactNode, number] {
  const inCollection = useSelector(getPacksInCollection);
  const showCustomContent = useSelector(getShowCustomContent);
  const ignore_collection = useSettingValue('ignore_collection');
  const [limitedSlots, toggleLimitedSlots] = useFlag(false);
  const slots = parsedDeck?.slots;
  const investigator = parsedDeck?.investigator;
  const [attachablesForCard, investigatorAttachment] = useDeckAttachments(investigator, slots);
  const investigatorAttachmentSlots = useDeckAttachmentSlots(parsedDeck?.id, investigatorAttachment);
  const lockedPermanents = parsedDeck?.lockedPermanents;
  const [uniqueBondedCards, bondedCounts, bondedCardsCount] = useMemo((): [Card[], Slots, number] => {
    if (!slots) {
      return [[], {}, 0];
    }
    const bondedCards: Card[] = [];
    const bondedCounts: Slots = {};
    if (investigator?.back.real_name) {
      const possibleBondedInvestigatorCards = bondedCardsByName?.[investigator.back.real_name];
      forEach(possibleBondedInvestigatorCards, bonded => {
        bondedCards.push(bonded);
        bondedCounts[bonded.code] = 1;
      });
    }
    forEach(slots, (count, code) => {
      const card = cards[code];
      if (count > 0 && card) {
        const possibleBondedCards = bondedCardsByName?.[card.real_name];
        if (possibleBondedCards && possibleBondedCards.length) {
          forEach(possibleBondedCards, bonded => {
            bondedCards.push(bonded);
            bondedCounts[bonded.code] = ((BONDED_WEAKNESS_COUNTS[card.code] ?? 0) * count) || (bonded.quantity ?? 0);
          });
        }
      }
    });

    if (!bondedCards.length) {
      return [[], {}, 0];
    }
    const uniqueBondedCards = uniqBy(bondedCards, c => c.code);
    const bondedCardsCount = sumBy(uniqueBondedCards, card => bondedCounts[card.code]);
    return [uniqueBondedCards, bondedCounts, bondedCardsCount];
  }, [slots, investigator, cards, bondedCardsByName]);
  const theLimitSlotCount = useMemo(() => find(investigator?.back.deck_options, option => !!option.limit)?.limit || 0, [investigator?.back]);
  const [data, setData] = useState<DeckSection[]>([]);
  const customizations = parsedDeck?.customizations;

  useEffect(() => {
    if (!parsedDeck?.investigator || !visible) {
      return;
    }
    const normalCards = parsedDeck.normalCards;
    const specialCards = parsedDeck.specialCards;
    const sideCards = parsedDeck.sideCards;
    const extraCards = parsedDeck.extraCards;
    const slots = parsedDeck.slots;
    const deckCards = parsedDeck.deckCards;
    const validation = new DeckValidation(parsedDeck.investigator, slots, meta);
    const shouldDraft = !parsedDeck.changes && !!showDraftCards;
    const hasNormalCards = (!!normalCards.Assets?.length ||
      !!normalCards.Enemy?.length ||
      !!normalCards.Event?.length ||
      !!normalCards.Skill?.length ||
      !!normalCards.Treachery?.length
    );
    const isArkhamDbDeck = !!parsedDeck.id?.id;

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
      deckCards,
      cards,
      cardsByName,
      validation,
      customizations,
      undefined,
      {
        inCollection,
        ignoreCollection: ignore_collection,
        showCustomContent,
      },
      isArkhamDbDeck,
    );
    const [specialSection, specialIndex] = deckToSections(
      t`Special Cards`,
      showEditSpecial,
      undefined,
      deckIndex,
      specialCards,
      deckCards,
      cards,
      cardsByName,
      validation,
      customizations,
      'special',
      {
        inCollection,
        ignoreCollection: ignore_collection,
        showCustomContent,
      },
      isArkhamDbDeck,
      {
        extraSections: requiredCards && [{
          title: t`Other investigator cards`,
          codes: requiredCards,
        }],
      },
    );
    const newData: DeckSection[] = [deckSection, specialSection];
    let currentIndex = specialIndex;

    if (investigatorAttachment) {
      const theSlots = {
        ...(mode === 'view' ? investigatorAttachmentSlots : slots),
        ...(investigatorAttachment.requiredCards ?? {}),
      };
      const possibleCards = filter(flatMap(Object.keys(theSlots), code => cards[code] ?? []), c =>
        !!investigatorAttachment.requiredCards?.[c.code] ||
        !!investigatorAttachment.traits?.find(t => c.real_traits_normalized?.indexOf(`#${t}#`) !== -1)
      );
      const [section, attachmentIndex] = attachmentSection(investigatorAttachment, theSlots, possibleCards, investigatorAttachmentSlots, currentIndex);
      if (section) {
        newData.push(section)
        currentIndex = attachmentIndex;
      }
    }

    const [bonded, bondedIndex] = bondedSections(uniqueBondedCards, bondedCounts, bondedCardsCount, currentIndex);
    if (bonded) {
      newData.push(bonded);
      currentIndex = bondedIndex;
    }

    if (theLimitSlotCount > 0) {
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
            deckCards,
            cards,
            cardsByName,
            validation,
            {
              inCollection,
              ignoreCollection: ignore_collection,
              showCustomContent,
            },
            isArkhamDbDeck
          ),
          customizable: hasCustomizationUpgrades(card.id, deckCards, cards, customizations, validation),
        };
      });
      const count = sumBy(limitedCards, card => slots[card.id] || 0);
      if (count > 0) {
        const limitSlotCount = (validation.investigator.back.code === THE_INSANE_CODE ?
          validation.getInsaneData(flatMap(keys(slots), (code) => {
            const card = cards[code];
            const count = (slots[code] ?? 0);
            if (!card || count <= 0) {
              return [];
            }
            return map(range(0, count), () => card);
          })).weaknessCount : undefined) ?? theLimitSlotCount;
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
    const [extraSection, extraIndex] = parsedDeck.investigator.back.code === PARALLEL_JIM_CODE && extraCards ?
      deckToSections(
        t`Spirit Deck`,
        showEditExtra,
        shouldDraft ? (
          <RoundedFooterDoubleButton
            onPressA={showEditExtra}
            titleA={t`Add cards`}
            iconA="addcard"
            onPressB={showDraftExtraCards}
            titleB={t`Draft cards`}
            iconB="draft"
          />
        ) : (
          <RoundedFooterButton
            title={t`Add cards`}
            icon="addcard"
            onPress={showEditExtra}
          />
        ),
        currentIndex,
        extraCards,
        deckCards,
        cards,
        cardsByName,
        new DeckValidation(parsedDeck.investigator, slots, meta, { extra_deck: true }),
        customizations,
        'extra',
        {
          inCollection,
          ignoreCollection: ignore_collection,
          showCustomContent,
        },
        isArkhamDbDeck,
      ) : [undefined, currentIndex];
    if (extraSection) {
      newData.push(extraSection);
    }
    currentIndex = extraIndex;

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
      deckCards,
      cards,
      cardsByName,
      validation,
      customizations,
      'side',
      {
        inCollection,
        ignoreCollection: ignore_collection,
        showCustomContent,
      },
      isArkhamDbDeck,
      {
        sumXp: true,
        existingSlots: slots,
      }
    );
    if (editable || sideSection.sections.length) {
      newData.push(sideSection);
    }
    currentIndex = sideIndex;
    setData(newData);
  }, [
    investigatorAttachment,
    investigatorAttachmentSlots,
    mode,
    bondedCounts, showCustomContent, showEditExtra,
    customizations,
    requiredCards,
    theLimitSlotCount,
    ignore_collection,
    limitedSlots,
    uniqueBondedCards,
    bondedCardsCount,
    inCollection,
    parsedDeck, meta, cards,
    showDraftCards, showDraftExtraCards, showEditCards, showEditSpecial, showEditSide, setData, toggleLimitedSlots,
    cardsByName,
    editable,
    visible,
  ]);

  const faction = parsedDeck?.faction ?? 'neutral';
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
  const controlForCard = useCallback((item: SectionCardId, card: Card, count: number | undefined, countMode: 'ignore' | 'side' | 'extra' | undefined): ControlType | undefined => {
    if (card.code === RANDOM_BASIC_WEAKNESS && editable && showDrawWeakness) {
      return {
        type: 'shuffle',
        count,
        onShufflePress: () => showDrawWeakness(true),
      };
    }
    if (!deckId) {
      return undefined;
    }
    const possibleAttachments = mode === 'view' && item.mode === 'attachment' ? [] : attachablesForCard(card);
    if (mode === 'view' || item.mode === 'bonded') {
      return count !== undefined ? {
        type: 'deck_count',
        count,
        deckId,
        attachments: possibleAttachments,
      } : undefined;
    }

    const upgradeEnabled = editable && item.hasUpgrades;
    return {
      type: 'upgrade',
      deckId: deckId,
      mode: countMode,
      editable: !!editable,
      min: lockedPermanents?.[card.code],
      limit: card.collectionDeckLimit(inCollection, ignore_collection),
      onUpgradePress: upgradeEnabled ? showCardUpgradeDialog : (undefined),
      customizable: !!editable && item.customizable,
      attachments: possibleAttachments,
    };
  }, [mode, lockedPermanents, deckId,
    attachablesForCard,
    showCardUpgradeDialog, showDrawWeakness, ignore_collection, editable, inCollection]);
  const singleCardView = useSettingValue('single_card');
  const { colors } = useContext(StyleContext);
  const showSwipeCard = useCallback((id: string, card: Card) => {
    if (singleCardView) {
      showCard(
        componentId,
        card.code,
        card,
        colors,
        { showSpoilers: true, deckId, initialCustomizations: customizations, tabooSetId },
      );
      return;
    }
    const index = parseInt(id, 10);
    const visibleCards: Card[] = [];
    const controls: ('deck' | 'side' | 'extra' | 'special' | 'ignore' | 'attachment' | 'bonded')[] = [];
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
      investigator?.front,
      editable,
      customizations,
    );
  }, [componentId, customizations, data, editable, colors, deckId, investigator, tabooSetId, singleCardView, cards]);
  const { listSeperator } = useContext(LanguageContext);
  const renderCard = useCallback((item: SectionCardId, index: number, section: CardSection, isLoading: boolean) => {
    const card = cards[item.id];
    if (!card) {
      return null;
    }
    const [count, mode] = getCount(item);
    const cardCustomizations = customizations?.[card.code];
    const customizedCard = card.withCustomizations(listSeperator, cardCustomizations)
    return (
      <CardSearchResult
        key={item.index}
        card={customizedCard}
        id={`${item.index}`}
        invalid={item.invalid}
        onPressId={showSwipeCard}
        control={controlForCard(item, customizedCard, count, mode)}
        faded={count === 0}
        noBorder={!isLoading && section.last && index === (section.cards.length - 1)}
        noSidePadding
      />
    );
  }, [listSeperator, showSwipeCard, controlForCard, cards, customizations]);

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