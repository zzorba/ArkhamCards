import React from 'react';
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { map } from 'lodash';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { Navigation, EventSubscription } from 'react-native-navigation';
import SideMenu from 'react-native-side-menu';
import {
  SettingsButton,
  SettingsCategoryHeader,
} from 'react-native-settings-components';
import { t } from 'ttag';

import ScenarioComponent from './ScenarioComponent';
import { NavigationProps } from '../../types';
import { Campaign, CUSTOM } from '../../../actions/types';
import { getCampaign, getAllDecks, getLatestCampaignDeckIds, getLatestCampaignInvestigators, AppState } from '../../../reducers';
import { getCampaignGuide } from '../../../data/scenario';

export interface CampaignGuideProps {
  campaignId: number;
}

interface ReduxProps {
  campaign?: Campaign;
}

type Props = CampaignGuideProps & NavigationProps & ReduxProps;

class CampaignGuideView extends React.Component<Props> {
  campaignGuide(campaign: Campaign) {
    return getCampaignGuide(campaign.cycleCode);
  }

  render() {
    const { campaign } = this.props;
    if (!campaign || campaign.cycleCode === CUSTOM) {
      return null;
    }
    const guide = this.campaignGuide(campaign);
    if (!guide) {
      return null;
    }
    const scenario = guide.getScenario('midnight_masks');
    if (!scenario) {
      return null;
    }
    return (
      <ScrollView>
        { <Text>{guide.campaign.campaign.name}</Text> }
        <ScenarioComponent scenario={scenario} guide={guide} />
      </ScrollView>
    )
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

export default connect<ReduxProps, {}, NavigationProps & OwnProps, AppState>(
  mapStateToProps
)(CampaignGuideView);
