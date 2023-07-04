import React, { useMemo } from 'react';

import { queryForInvestigator } from '@lib/InvestigatorRequirements';
import { NavigationProps } from '@components/nav/types';
import CardSearchComponent from './CardSearchComponent';
import useSingleCard from '@components/card/useSingleCard';
import { FilterState } from '@lib/filters';

export interface InvestigatorCardsProps {
  investigatorCode: string;
}

type Props = NavigationProps & InvestigatorCardsProps;

export default function InvestigatorCardsView({ investigatorCode, componentId }: Props) {
  const [investigator] = useSingleCard(investigatorCode, 'player');
  const query = useMemo(() => {
    if (!investigator) {
      return undefined;
    }
    return (filters: FilterState | undefined) => queryForInvestigator(investigator, undefined, filters);
  }, [investigator]);
  if (!investigator) {
    return null;
  }
  return (
    <CardSearchComponent
      componentId={componentId}
      baseQuery={query}
      screenType="investigator"
    />
  );
}
