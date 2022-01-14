import React, { ReactNode } from 'react';
import { map } from 'lodash';
import { View } from 'react-native';
import { DeckId } from '@actions/types';

export interface CampaignDeckListProps {
  componentId: string;
  investigatorToDeck: {
    [code: string]: DeckId | undefined;
  };
  investigatorIds: string[];
}

interface Props extends CampaignDeckListProps {
  renderDeck: (deckId: DeckId, investigator: string) => ReactNode;
  renderInvestigator: (investigator: string) => ReactNode;
}

export default function CampaignDeckList({
  investigatorIds,
  investigatorToDeck,
  renderDeck,
  renderInvestigator,
}: Props) {
  return (
    <View>
      { map(investigatorIds, investigator => {
        const deckId = investigatorToDeck[investigator];
        if (deckId) {
          return renderDeck(deckId, investigator);
        }
        return renderInvestigator(investigator)
      }) }
    </View>
  );
}
