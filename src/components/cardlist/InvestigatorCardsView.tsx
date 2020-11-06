import React from 'react';

import { queryForInvestigator } from '@lib/InvestigatorRequirements';
import { NavigationProps } from '@components/nav/types';
import CardSearchComponent from './CardSearchComponent';
import useSingleCard from '@components/card/useSingleCard';

export interface InvestigatorCardsProps {
  investigatorCode: string;
}

type Props = NavigationProps & InvestigatorCardsProps;

export default function InvestigatorCardsView({ investigatorCode, componentId }: Props) {
  const [investigator] = useSingleCard(investigatorCode, 'player');
  if (!investigator) {
    return null;
  }
  return (
    <CardSearchComponent
      componentId={componentId}
      baseQuery={queryForInvestigator(investigator)}
    />
  );
}
