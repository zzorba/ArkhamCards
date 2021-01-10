import React, { ReactNode } from 'react';
import { map } from 'lodash';
import { View } from 'react-native';

export interface CampaignDeckListProps {
  componentId: string;
  deckIds: number[];
  investigatorIds: string[];
}

interface Props extends CampaignDeckListProps {
  renderDeck: (deckId: number) => ReactNode;
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
