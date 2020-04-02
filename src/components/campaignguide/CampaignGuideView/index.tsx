import React from 'react';
import { Text } from 'react-native';
import { t } from 'ttag';

import TabView from 'components/core/TabView';
import CampaignLogTab from './CampaignLogTab';
import ScenarioListTab from './ScenarioListTab';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import { CampaignGuideContextType } from '../CampaignGuideContext';
import withCampaignGuideContext, { CampaignGuideInputProps } from '../withCampaignGuideContext';
import { NavigationProps } from 'components/nav/types';
import { CUSTOM } from 'actions/types';

export type CampaignGuideProps = CampaignGuideInputProps;

type Props = CampaignGuideProps & NavigationProps & DimensionsProps;

class CampaignGuideView extends React.Component<Props & CampaignGuideContextType> {
  _onTabChange = (tab: string) => {
  };

  render() {
    const {
      campaign,
      campaignGuide,
      campaignState,
      fontScale,
      componentId,
    } = this.props;
    if (campaign.cycleCode === CUSTOM) {
      return (
        <Text>No custom scenarios</Text>
      );
    }
    const processedCampaign = campaignGuide.processAllScenarios(campaignState);
    const tabs = [
      {
        key: 'log',
        title: t`Campaign Log`,
        node: (
          <CampaignLogTab
            campaignGuide={campaignGuide}
            campaignLog={processedCampaign.campaignLog}
            fontScale={fontScale}
          />
        ),
      },
      {
        key: 'scenarios',
        title: t`Scenarios`,
        node: (
          <ScenarioListTab
            campaign={campaign}
            processedCampaign={processedCampaign}
            fontScale={fontScale}
            componentId={componentId}
          />
        )
      },
    ];

    return (
      <TabView
        tabs={tabs}
        onTabChange={this._onTabChange}
      />
    );
  }
}

export default withDimensions(
  withCampaignGuideContext<Props>(
    CampaignGuideView
  )
);
