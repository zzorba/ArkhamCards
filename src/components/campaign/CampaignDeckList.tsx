import React, { ReactNode } from 'react';
import { map } from 'lodash';
import { View } from 'react-native';
import { DeckId } from '@actions/types';

export interface CampaignDeckListProps {
  investigatorToDeck: {
    [code: string]: DeckId | undefined;
  };
  investigatorIds: { code: string; printing?: string }[];
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
        const deckId = investigatorToDeck[investigator.code];
        if (deckId) {
          return renderDeck(deckId, investigator.printing ?? investigator.code);
        }
        return renderInvestigator(investigator.printing ?? investigator.code)
      }) }
    </View>
  );
}
