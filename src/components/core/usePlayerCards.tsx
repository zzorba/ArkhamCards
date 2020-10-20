import { useContext } from 'react';
import { useSelector } from 'react-redux';

import { CardsMap } from '@data/Card';
import DatabaseContext from '@data/DatabaseContext';
import { AppState, getTabooSet } from '@reducers';

export default function useInvestigatorCards(tabooSetOverride?: number): CardsMap | undefined {
  const tabooSetId = useSelector((state: AppState) => getTabooSet(state, tabooSetOverride));
  const { playerCardsByTaboo } = useContext(DatabaseContext);
  const playerCards = playerCardsByTaboo && playerCardsByTaboo[`${tabooSetId || 0}`];
  return playerCards?.cards;
}
