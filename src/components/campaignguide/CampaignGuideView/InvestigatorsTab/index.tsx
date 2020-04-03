import React from 'react';
import { ScrollView } from 'react-native';
import { map, partition } from 'lodash';
import { connect } from 'react-redux';

import { Campaign, DecksMap } from 'actions/types';
import InvestigatorCampaignRow from './InvestigatorCampaignRow';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import withPlayerCards, { PlayerCardProps } from 'components/core/withPlayerCards';
import { getAllDecks, getLatestCampaignDeckIds, getLatestCampaignInvestigators, AppState } from 'reducers';
import Card from 'data/Card';

interface OwnProps {
  campaign: Campaign;
  campaignLog: GuidedCampaignLog;
  fontScale: number;
}

interface ReduxProps {
  latestDeckIds: number[];
  decks: DecksMap;
  allInvestigators: Card[];
}

type Props = OwnProps & PlayerCardProps & ReduxProps;
class InvestigatorsTab extends React.Component<Props> {
  render() {
    const {
      allInvestigators,
      campaignLog,
      fontScale,
    } = this.props;
    const [killedInvestigators, aliveInvestigators] = partition(allInvestigators,
      investigator => {
        const trauma = campaignLog.traumaAndCardData(investigator.code);
        return investigator.eliminated(trauma);
      }
    );
    return (
      <ScrollView>
        { map(aliveInvestigators, investigator => (
          <InvestigatorCampaignRow
            key={investigator.code}
            fontScale={fontScale}
            investigator={investigator}
            traumaAndCardData={campaignLog.traumaAndCardData(investigator.code)}
          />
        )) }
        { map(killedInvestigators, investigator => (
         <InvestigatorCampaignRow
           key={investigator.code}
           investigator={investigator}
           traumaAndCardData={campaignLog.traumaAndCardData(investigator.code)}
         />
       )) }
      </ScrollView>
    )
  }
}

function mapStateToProps(
  state: AppState,
  props: OwnProps & PlayerCardProps
): ReduxProps {
  const decks = getAllDecks(state);
  const latestDeckIds = getLatestCampaignDeckIds(state, props.campaign);
  const allInvestigators = getLatestCampaignInvestigators(state, props.investigators, props.campaign);
  return {
    allInvestigators,
    latestDeckIds,
    decks,
  };
}


export default withPlayerCards(
  connect(mapStateToProps)(InvestigatorsTab)
);
