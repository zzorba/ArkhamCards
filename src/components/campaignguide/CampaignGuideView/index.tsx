import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { map } from 'lodash';
import { connect } from 'react-redux';

import { campaignScenarios, Scenario } from 'components/campaign/constants';
import { NavigationProps } from 'components/nav/types';
import { SingleCampaign, CUSTOM } from 'actions/types';
import { getCampaignGuide } from 'data/scenario';
import { getCampaign, AppState } from 'reducers';
import ScenarioButton from './ScenarioButton';

export interface CampaignGuideProps {
  campaignId: number;
}

interface ReduxProps {
  campaign?: SingleCampaign;
}

type Props = CampaignGuideProps & NavigationProps & ReduxProps;

class CampaignGuideView extends React.Component<Props> {
  campaignGuide(campaign: SingleCampaign) {
    return getCampaignGuide(campaign.cycleCode);
  }

  possibleScenarios(): Scenario[] {
    const {
      campaign,
    } = this.props;
    if (!campaign) {
      return [];
    }
    return campaignScenarios(campaign.cycleCode);
  }

  render() {
    const { campaign, componentId } = this.props;
    if (!campaign || campaign.cycleCode === CUSTOM) {
      return null;
    }
    const guide = this.campaignGuide(campaign);
    if (!guide) {
      return null;
    }
    return (
      <ScrollView>
        <View style={styles.margin}>
          { map(this.possibleScenarios(), (scenario, idx) => (
            <ScenarioButton
              key={idx}
              componentId={componentId}
              scenario={scenario}
              campaign={campaign}
            />
          )) }
        </View>
      </ScrollView>
    );
  }
}


function mapStateToProps(
  state: AppState,
  props: NavigationProps & CampaignGuideProps
): ReduxProps {
  const campaign = getCampaign(state, props.campaignId);
  return {
    campaign,
  };
}

export default connect<ReduxProps, {}, NavigationProps & CampaignGuideProps, AppState>(
  mapStateToProps
)(CampaignGuideView);

const styles = StyleSheet.create({
  margin: {
    margin: 16,
  },
});
