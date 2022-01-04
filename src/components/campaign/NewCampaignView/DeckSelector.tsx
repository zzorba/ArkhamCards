import React, { useCallback, useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';

import CampaignDeckList, { CampaignDeckListProps } from '../CampaignDeckList';
import { Deck, DeckId } from '@actions/types';
import Card from '@data/types/Card';
import { useDeckWithFetch, useInvestigatorCards, useInvestigators } from '@components/core/hooks';
import { DeckActions, useDeckActions } from '@data/remote/decks';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import CompactInvestigatorRow from '@components/core/CompactInvestigatorRow';
import AppIcon from '@icons/AppIcon';
import COLORS from '@styles/colors';

interface Props extends CampaignDeckListProps {
  deckRemoved?: (
    id: DeckId,
    deck?: Deck,
    investigator?: Card
  ) => void;

  investigatorRemoved?: (
    investigator: Card
  ) => void;
}

function CustomInvestigatorRow({ investigator, onRemove }: { investigator: Card, onRemove?: () => void }) {
  const { width } = useContext(StyleContext);
  return (
    <View style={[space.paddingSideS, space.paddingVerticalXs]}>
      <CompactInvestigatorRow
        investigator={investigator}
        width={width - s * 4}
      >
        { !!onRemove && (
          <TouchableOpacity onPress={onRemove}>
            <AppIcon name="trash" size={40} color={COLORS.L30} />
          </TouchableOpacity>
        ) }
      </CompactInvestigatorRow>
    </View>
  );
}

function InvestigatorOnlyRow({ investigator, investigatorRemoved }: { investigator: Card; investigatorRemoved?: (card: Card) => void }) {
  const onRemove = useCallback(() => {
    investigatorRemoved && investigatorRemoved(investigator);
  }, [investigatorRemoved, investigator]);
  return (
    <CustomInvestigatorRow investigator={investigator} onRemove={investigatorRemoved ? onRemove : undefined} />
  );
}

function InvestigatorDeckRow({ id, actions, deckRemoved }: {
  id: DeckId;
  actions: DeckActions;
  deckRemoved?: (
    id: DeckId,
    deck?: Deck,
    investigator?: Card
  ) => void;
}) {
  const deck = useDeckWithFetch(id, actions);
  const investigators = useInvestigatorCards(deck?.deck.taboo_id || 0);
  const investigator = deck && investigators && investigators[deck.deck.investigator_code];
  const onRemove = useCallback(() => {
    deckRemoved && deckRemoved(id, deck?.deck, investigator);
  }, [deckRemoved, id, deck, investigator]);
  if (!deck || !investigator) {
    return null;
  }
  return (
    <CustomInvestigatorRow investigator={investigator} onRemove={deckRemoved ? onRemove : undefined} />
  );
}


export default function DeckSelector({
  investigatorRemoved,
  deckRemoved,
  componentId,
  investigatorToDeck,
  investigatorIds,
}: Props) {
  const investigators = useInvestigators(investigatorIds);
  const actions = useDeckActions();
  const renderDeck = useCallback((deckId: DeckId, code: string) => {
    const investigator = investigators && investigators[code];
    if (!investigator) {
      return null;
    }
    return (
      <InvestigatorDeckRow
        key={deckId.uuid}
        id={deckId}
        deckRemoved={deckRemoved}
        actions={actions}
      />
    );
  }, [deckRemoved, actions, investigators]);

  const renderInvestigator = useCallback((code: string) => {
    const investigator = investigators && investigators[code];
    if (!investigator) {
      return null;
    }
    return (
      <InvestigatorOnlyRow
        key={code}
        investigator={investigator}
        investigatorRemoved={investigatorRemoved}
      />
    );
  }, [investigatorRemoved, investigators]);

  return (
    <CampaignDeckList
      renderDeck={renderDeck}
      renderInvestigator={renderInvestigator}
      componentId={componentId}
      investigatorToDeck={investigatorToDeck}
      investigatorIds={investigatorIds}
    />
  );
}
