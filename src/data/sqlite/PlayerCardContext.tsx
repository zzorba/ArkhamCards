import React from 'react';
import Card, { CardsMap } from '@data/types/Card';
import InvestigatorSet from '@data/types/InvestigatorSet';


export interface PlayerCardContext {
  getExistingCards: (tabooSetId: number) => CardsMap;
  getPlayerCards: (codes: string[], tabooSetId: number, store: boolean) => Promise<CardsMap>;
  storePlayerCards: (cards: Card[]) => void;
  investigatorSets: InvestigatorSet[] | undefined;
}

export const PlayerCardContext = React.createContext<PlayerCardContext>(
  // @ts-ignore TS2345
  {}
);
