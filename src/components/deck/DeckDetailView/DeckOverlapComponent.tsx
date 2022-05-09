import React, { useMemo, useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Text, View, StyleSheet } from 'react-native';
import { filter, forEach, findIndex, map, groupBy, values, flatMap, sumBy, keys } from 'lodash';
import { t, ngettext, msgid } from 'ttag';

import { RANDOM_BASIC_WEAKNESS } from '@app_constants';
import { CampaignId, ParsedDeck, Slots } from '@actions/types';
import { useCampaignGuideContext } from '@components/campaignguide/withCampaignGuideContext';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import { useFlag, useSettingValue, useToggles } from '@components/core/hooks';
import { getPacksInCollection } from '@reducers';
import Card, { CardsMap } from '@data/types/Card';
import DeckSectionBlock from '../section/DeckSectionBlock';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import { showCard, showCardSwipe } from '@components/nav/helper';
import StyleContext from '@styles/StyleContext';
import DeckBubbleHeader from '../section/DeckBubbleHeader';
import space from '@styles/space';
import InvestigatorImageButton from '@components/core/InvestigatorImageButton';

interface Props {
  parsedDeck?: ParsedDeck;
  campaignId: CampaignId;
  live: boolean;
  componentId: string;
  cards: CardsMap;
}

interface OverlapSection {
  investigator?: Card;
  deck?: LatestDeckT;
  conflicts: {
    id: string;
    card: Card;
    count: number;
  }[];
}

function OverlapSectionComponent({
  overlap: { investigator, conflicts },
  onPressId,
}: {
  overlap: OverlapSection;
  onPressId: (code: string, card: Card) => void;
}) {
  const count = sumBy(conflicts, c => c.count);
  const countText = ngettext(msgid`(${count} card)`, `(${count} cards)`, count);
  return (
    <View>
      { !!investigator && (
        <View style={space.paddingSideS}>
          <DeckBubbleHeader title={`— ${investigator.name} ${countText} —`} />
        </View>
      ) }
      { map(conflicts, overlap => (
        <CardSearchResult
          key={overlap.card.code}
          id={overlap.id}
          card={overlap.card}
          onPressId={onPressId}
          control={{ type: 'count', count: overlap.count }}
        />
      )) }
    </View>
  );
}

export default function DeckOverlapComponent({ parsedDeck, componentId, cards }: {
  parsedDeck?: ParsedDeck;
  componentId: string;
  cards: CardsMap;
}) {
  const { campaignInvestigators, latestDecks, campaign } = useContext(CampaignGuideContext);
  const { colors, typography } = useContext(StyleContext);
  const in_collection = useSelector(getPacksInCollection);
  const [excludeInvestigators, toggleExcludeInvestigators] = useToggles({});
  const ignore_collection = useSettingValue('ignore_collection');
  const currentInvestigator = parsedDeck?.investigator.code;
  const activeDeckInvestigators = useMemo(() => {
    return filter(campaignInvestigators, investigator => {
      if (investigator.code === currentInvestigator ||
        investigator.eliminated(campaign.getInvestigatorData(investigator.code))) {
        return false;
      }
      const deck = latestDecks[investigator.code];
      return !!deck;
    });
  }, [campaignInvestigators, currentInvestigator, latestDecks, campaign]);
  const [overlap] = useMemo(() => {
    if (!cards) {
      return [[], true];
    }
    const allSlots: Slots = parsedDeck ? { ...parsedDeck.slots } : {};
    const investigatorCards: { [code: string]: Card[] | undefined } = {};
    forEach(activeDeckInvestigators, investigator => {
      if (excludeInvestigators[investigator.code]) {
        return;
      }
      const deck = latestDecks[investigator.code];
      if (!deck) {
        return;
      }
      forEach(deck.deck.slots, (quantity, code) => {
        if (!parsedDeck || (allSlots[code] || 0) > 0) {
          allSlots[code] = (allSlots[code] || 0) + quantity;
          investigatorCards[code] = [
            ...(investigatorCards[code] || []),
            investigator,
          ];
        }
      });
    });
    const overlap: {
      card: Card;
      investigator?: Card;
      count: number;
      limit: number;
    }[] = [];
    forEach(allSlots, (count, code) => {
      const card = cards[code];
      if (!card || card.code === RANDOM_BASIC_WEAKNESS) {
        return;
      }
      const limit = card.collectionQuantity(in_collection, ignore_collection);
      if (count > limit) {
        if (parsedDeck) {
          forEach(investigatorCards[code] || [], investigator => {
            overlap.push({
              card,
              investigator,
              count,
              limit,
            });
          });
        } else {
          overlap.push({ card, count, limit });
        }
      }
    });
    if (parsedDeck) {
      const grouped = groupBy(overlap, o => o.investigator?.code || '');
      const result = flatMap(values(grouped), g => {
        if (!g.length) {
          return [];
        }
        const investigator = g[0].investigator;
        return {
          investigator,
          deck: investigator ? latestDecks[investigator.code] : undefined,
          conflicts: map(g, o => {
            return {
              id: `${investigator?.code} - ${o.card.code}`,
              card: o.card,
              count: o.count - o.limit,
            };
          }),
        };
      });
      return [result, false];
    }
    if (!overlap.length) {
      return [[], false];
    }
    const section: OverlapSection = {
      conflicts: map(overlap, o => {
        return {
          id: o.card.code,
          card: o.card,
          count: o.count - o.limit,
        };
      }),
    };
    return [[section], false];
  }, [excludeInvestigators, activeDeckInvestigators, latestDecks, cards, parsedDeck, ignore_collection, in_collection]);
  const [open, toggleOpen] = useFlag(false);
  const singleCardView = useSettingValue('single_card');
  const showCardPressed = useCallback((id: string, card: Card) => {
    if (singleCardView) {
      showCard(componentId, card.code, card, colors, true);
    } else {
      const allCards = flatMap(overlap, o => o.conflicts);
      showCardSwipe(
        componentId,
        map(allCards, card => card.card.code),
        undefined,
        findIndex(allCards, c => c.id === id),
        colors,
        map(allCards, o => o.card),
        true,
        parsedDeck?.deck?.taboo_id,
        undefined,
        parsedDeck?.investigator,
        false
      );
    }
  }, [colors, overlap, componentId, parsedDeck, singleCardView]);

  if (!overlap.length && !keys(excludeInvestigators).length) {
    return null;
  }
  return (
    <DeckSectionBlock
      faction={parsedDeck?.investigator.factionCode() || 'neutral'}
      title={parsedDeck ? t`Collection overlap` : t`Deck overlap`}
      collapsedText={!open ? t`Show collection overlap` : t`Hide collection overlap`}
      collapsed={!open}
      toggleCollapsed={toggleOpen}
      noSpace
    >
      <Text style={[typography.small, space.paddingS]}>
        { t`The total number of these cards among decks from this campaign exceeds your card collection.` }
      </Text>
      <View style={[styles.leftRow, space.paddingS, space.paddingBottomM]}>
        { map(activeDeckInvestigators, investigator => (
          investigator.code === parsedDeck?.investigator.code || excludeInvestigators[investigator.code] ? null :
          <View style={space.paddingRightS} key={investigator.code}>
            <InvestigatorImageButton
              onPress={toggleExcludeInvestigators}
              selected={!excludeInvestigators[investigator.code]}
              card={investigator}
              size="tiny"
            />
          </View>
        )) }
        <View style={styles.rightRow}>
          { map(activeDeckInvestigators, investigator => (
            investigator.code === parsedDeck?.investigator.code || !excludeInvestigators[investigator.code] ? null :
            <View style={space.paddingLeftS} key={investigator.code}>
              <InvestigatorImageButton
                onPress={toggleExcludeInvestigators}
                selected={!excludeInvestigators[investigator.code]}
                card={investigator}
                size="tiny"
              />
            </View>
          )) }
        </View>
      </View>
      { map(overlap, (overlap) => (
        <OverlapSectionComponent
          key={overlap.investigator?.code || 'default'}
          overlap={overlap}
          onPressId={showCardPressed}
        />
      )) }
    </DeckSectionBlock>
  );
}

export function DeckOverlapComponentForCampaign({ parsedDeck, campaignId, live, componentId, cards }: Props) {
  const [campaignGuideContext] = useCampaignGuideContext(campaignId, live);
  if (!campaignGuideContext) {
    return null;
  }
  return (
    <CampaignGuideContext.Provider value={campaignGuideContext}>
      <DeckOverlapComponent
        componentId={componentId}
        parsedDeck={parsedDeck}
        cards={cards}
      />
    </CampaignGuideContext.Provider>
  );
}

const styles = StyleSheet.create({
  rightRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
  leftRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});