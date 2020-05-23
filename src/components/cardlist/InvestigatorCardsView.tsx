import React from 'react';

import SingleCardWrapper from 'components/card/SingleCardWrapper';
import { queryForInvestigator } from 'lib/InvestigatorRequirements';
import Card from 'data/Card';
import { NavigationProps } from 'components/nav/types';
import CardSearchComponent from './CardSearchComponent';

export interface InvestigatorCardsProps {
  investigatorCode: string;
}

type Props = NavigationProps & InvestigatorCardsProps;

export default class InvestigatorCardsView extends React.Component<Props> {
  render() {
    const { componentId, investigatorCode } = this.props;
    return (
      <SingleCardWrapper code={investigatorCode} extraArg={undefined}>
        { (investigator: Card) => (
          <CardSearchComponent
            componentId={componentId}
            baseQuery={queryForInvestigator(investigator)}
          />
        ) }
      </SingleCardWrapper>
    );
  }
}
