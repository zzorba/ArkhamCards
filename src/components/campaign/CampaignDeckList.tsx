import React, { ReactNode } from 'react';
import { map } from 'lodash';
import { View } from 'react-native';
import { DeckId } from '@actions/types';

export interface CampaignDeckListProps {
  componentId: string;
  deckIds: DeckId[];
  investigatorIds: string[];
}

interface Props extends CampaignDeckListProps {
  renderDeck: (deckId: DeckId) => ReactNode;
  renderInvestigator?: (investigator: string) => ReactNode;
}

export default function CampaignDeckList({
  deckIds,
  investigatorIds,
  renderDeck,
  renderInvestigator,
}: Props) {
  return (
    <View>
      { map(deckIds, deckId => (
        renderDeck(deckId)
      )) }
      { !!renderInvestigator && map(investigatorIds, investigator => (
        renderInvestigator(investigator)
      )) }
    </View>
  );
}
