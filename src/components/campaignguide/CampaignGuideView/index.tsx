import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { map } from 'lodash';

import CampaignLogComponent from './CampaignLogComponent';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import { CampaignGuideContextType } from '../CampaignGuideContext';
import withCampaignGuideContext, { CampaignGuideInputProps } from '../withCampaignGuideContext';
import { campaignScenarios, Scenario } from 'components/campaign/constants';
import { NavigationProps } from 'components/nav/types';
import { CUSTOM } from 'actions/types';
import ScenarioButton from './ScenarioButton';

export type CampaignGuideProps = CampaignGuideInputProps;

type Props = CampaignGuideProps & NavigationProps & DimensionsProps;

class CampaignGuideView extends React.Component<Props & CampaignGuideContextType> {
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
    const { campaign, fontScale, campaignGuide, campaignState, componentId } = this.props;
    if (campaign.cycleCode === CUSTOM) {
      return (
        <Text>No custom scenarios</Text>
      );
    }
    const processedCampaign = campaignGuide.processAllScenarios(campaignState);
    return (
      <ScrollView>
        { map(processedCampaign.scenarios, (scenario, idx) => (
          <ScenarioButton
            key={idx}
            fontScale={fontScale}
            componentId={componentId}
            scenario={scenario}
            campaign={campaign}
          />
        )) }
        <CampaignLogComponent
          campaignGuide={campaignGuide}
          campaignLog={processedCampaign.campaignLog}
          fontScale={fontScale}
        />
      </ScrollView>
    );
  }
}

export default withDimensions(
  withCampaignGuideContext<Props>(
    CampaignGuideView
  )
);

const styles = StyleSheet.create({
  margin: {
  },
});
