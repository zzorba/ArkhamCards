import React from 'react';
import { Button, Text, ScrollView, StyleSheet, View } from 'react-native';
import { map, partition } from 'lodash';
import { connect } from 'react-redux';
import { t } from 'ttag';

import { Campaign, DecksMap } from 'actions/types';
import InvestigatorCampaignRow from './InvestigatorCampaignRow';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import CampaignStateHelper from 'data/scenario/CampaignStateHelper';
import { LatestDecks } from '../../CampaignGuideContext';
import withPlayerCards, { PlayerCardProps } from 'components/core/withPlayerCards';
import { getAllDecks, getLatestCampaignDeckIds, getLatestCampaignInvestigators, AppState } from 'reducers';
import Card from 'data/Card';
import typography from 'styles/typography';

interface OwnProps {
  componentId: string;
  campaign: Campaign;
  campaignLog: GuidedCampaignLog;
  campaignState: CampaignStateHelper;
  fontScale: number;
  latestDecks: LatestDecks;
  chooseDeckForInvestigator: (investigator: Card) => void;
}

interface ReduxProps {
  latestDeckIds: number[];
  decks: DecksMap;
  allInvestigators: Card[];
}

type Props = OwnProps & PlayerCardProps & ReduxProps;
class InvestigatorsTab extends React.Component<Props> {
  _addInvestigator = () => {
    this.props.campaignState.showChooseDeck();
  };

  render() {
    const {
      allInvestigators,
      campaignLog,
      campaign,
      fontScale,
      componentId,
      latestDecks,
      chooseDeckForInvestigator,
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
            campaign={campaign}
            deck={latestDecks[investigator.code]}
            componentId={componentId}
            fontScale={fontScale}
            investigator={investigator}
            traumaAndCardData={campaignLog.traumaAndCardData(investigator.code)}
            chooseDeckForInvestigator={chooseDeckForInvestigator}
          />
        )) }
        <View style={styles.button}>
          <Button title={t`Add Investigator`} onPress={this._addInvestigator} />
        </View>
        { killedInvestigators.length > 0 && (
          <View style={styles.header}>
            <Text style={[typography.bigGameFont, typography.center, typography.underline]}>
              { t`Killed and Insane Investigators` }
            </Text>
          </View>
        )}
        { map(killedInvestigators, investigator => (
         <InvestigatorCampaignRow
           key={investigator.code}
           campaign={campaign}
           deck={latestDecks[investigator.code]}
           componentId={componentId}
           fontScale={fontScale}
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


export default withPlayerCards<OwnProps>(
  connect(mapStateToProps)(InvestigatorsTab)
);

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  header: {
    padding: 8,
    paddingTop: 32,
  },
});
