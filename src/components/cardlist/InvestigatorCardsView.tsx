import React, { useMemo } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/types';

import { queryForInvestigatorWithoutDeck } from '@lib/InvestigatorRequirements';
import CardSearchComponent from './CardSearchComponent';
import useSingleCard from '@components/card/useSingleCard';
import { FilterState } from '@lib/filters';

export interface InvestigatorCardsProps {
  investigatorCode: string;
}

export default function InvestigatorCardsView() {
  const route = useRoute<RouteProp<RootStackParamList, 'Browse.InvestigatorCards'>>();
  const { investigatorCode } = route.params;
  const [investigator] = useSingleCard(investigatorCode, 'player');
  const query = useMemo(() => {
    if (!investigator) {
      return undefined;
    }
    return (filters: FilterState | undefined) =>
      queryForInvestigatorWithoutDeck(
        { main: investigator, front: investigator, back: investigator },
        undefined,
        {
          filters,
          allOptions: true,
        }
      );
  }, [investigator]);
  if (!investigator) {
    return null;
  }
  return (
    <CardSearchComponent
      baseQuery={query}
      screenType="investigator"
    />
  );
}
