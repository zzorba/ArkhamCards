import React from 'react';
import Realm from 'realm';
import { connect } from 'react-redux';
import { head } from 'lodash';
import { connectRealm, CardResults } from 'react-native-realm';

import { queryForInvestigator } from 'lib/InvestigatorRequirements';
import Card from 'data/Card';
import { AppState, getTabooSet } from 'reducers';
import { NavigationProps } from 'components/nav/types';
import CardSearchComponent from './CardSearchComponent';

export interface InvestigatorCardsProps {
  investigatorCode: string;
}

interface ReduxProps {
  tabooSetId?: number;
}

interface RealmProps {
  investigator?: Card;
}

type Props = NavigationProps & ReduxProps & InvestigatorCardsProps & RealmProps;
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

function mapStateToProps(state: AppState): ReduxProps {
  return {
    tabooSetId: getTabooSet(state),
  };
}

export default connect<ReduxProps, {}, NavigationProps & InvestigatorCardsProps, AppState>(
  mapStateToProps
)(connectRealm<NavigationProps & InvestigatorCardsProps & ReduxProps, RealmProps, Card>(
  InvestigatorCardsView, {
    schemas: ['Card'],
    mapToProps(
      results: CardResults<Card>,
      realm: Realm,
      props: NavigationProps & InvestigatorCardsProps & ReduxProps
    ): RealmProps {
      const investigator =
        head(results.cards.filtered(`(code == "${props.investigatorCode}") and ${Card.tabooSetQuery(props.tabooSetId)}`));
      return {
        investigator,
      };
    },
  })
);
