import React from 'react';

import SingleCardWrapper from '@components/card/SingleCardWrapper';
import { queryForInvestigator } from '@lib/InvestigatorRequirements';
import Card from '@data/Card';
import { NavigationProps } from '@components/nav/types';
import CardSearchComponent from './CardSearchComponent';

export interface InvestigatorCardsProps {
  investigatorCode: string;
}

type Props = NavigationProps & InvestigatorCardsProps;

export default function InvestigatorCardsView({ investigatorCode, componentId }: Props) {
  return (
    <SingleCardWrapper code={investigatorCode} type="player">
      { (investigator: Card) => (
        <CardSearchComponent
          componentId={componentId}
          baseQuery={queryForInvestigator(investigator)}
        />
      ) }
    </SingleCardWrapper>
  );
}
