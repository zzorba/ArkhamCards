import React from 'react';
import Realm from 'realm';
import { head } from 'lodash';
import { connectRealm, CardResults } from 'react-native-realm';

import { queryForInvestigator } from '../lib/InvestigatorRequirements';
import Card from '../data/Card';
import CardSearchComponent from './CardSearchComponent';

interface OwnProps {
  componentId: string;
  investigatorCode: string
}

interface RealmProps {
  investigator?: Card;
}

type Props = OwnProps & RealmProps;
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

export default connectRealm<OwnProps, RealmProps, Card>(
  InvestigatorCardsView, {
  schemas: ['Card'],
  mapToProps(results: CardResults<Card>, realm: Realm, props: OwnProps): RealmProps {
    const investigator =
      head(results.cards.filtered(`code == "${props.investigatorCode}"`));
    return {
      investigator,
    };
  },
});
