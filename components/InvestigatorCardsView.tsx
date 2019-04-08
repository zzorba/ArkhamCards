import React from 'react';
import Realm from 'realm';
import { head } from 'lodash';
import { connectRealm, CardResults } from 'react-native-realm';

import { queryForInvestigator } from '../lib/InvestigatorRequirements';
import Card from '../data/Card';
import { NavigationProps } from './types';
import CardSearchComponent from './CardSearchComponent';

export interface InvestigatorCardsProps {
  investigatorCode: string
}

interface RealmProps {
  investigator?: Card;
}

type Props = NavigationProps & InvestigatorCardsProps & RealmProps;
class InvestigatorCardsView extends React.Component<Props> {
  render() {
    const {
      componentId,
      investigator,
    } = this.props;
    return (
      <CardSearchComponent
        componentId={componentId}
        baseQuery={investigator ? queryForInvestigator(investigator) : undefined}
      />
    );
  }
}

export default connectRealm<NavigationProps & InvestigatorCardsProps, RealmProps, Card>(
  InvestigatorCardsView, {
  schemas: ['Card'],
  mapToProps(
    results: CardResults<Card>,
    realm: Realm,
    props: NavigationProps & InvestigatorCardsProps
  ): RealmProps {
    const investigator =
      head(results.cards.filtered(`code == "${props.investigatorCode}"`));
    return {
      investigator,
    };
  },
});
