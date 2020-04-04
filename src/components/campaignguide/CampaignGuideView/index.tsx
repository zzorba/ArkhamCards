import React from 'react';
import { Platform, Text } from 'react-native';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { t } from 'ttag';

import { MyDecksSelectorProps } from 'components/campaign/MyDecksSelectorDialog';
import InvestigatorsTab from './InvestigatorsTab';
import CampaignLogTab from './CampaignLogTab';
import ScenarioListTab from './ScenarioListTab';
import { Deck, CUSTOM } from 'actions/types';
import TabView from 'components/core/TabView';
import Card from 'data/Card';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import { CampaignGuideContextType } from '../CampaignGuideContext';
import withCampaignGuideContext, { CampaignGuideInputProps } from '../withCampaignGuideContext';
import { NavigationProps } from 'components/nav/types';

export type CampaignGuideProps = CampaignGuideInputProps;

type Props = CampaignGuideProps & NavigationProps & DimensionsProps;

class CampaignGuideView extends React.Component<Props & CampaignGuideContextType> {
  _onTabChange = () => {
  };

  render() {
    const {
      campaign,
      campaignGuide,
      campaignState,
      fontScale,
      componentId,
      latestDecks,
    } = this.props;
    if (campaign.cycleCode === CUSTOM) {
      return (
        <Text>No custom scenarios</Text>
      );
    }
    const processedCampaign = campaignGuide.processAllScenarios(campaignState);
    const tabs = [
      {
        key: 'investigators',
        title: t`Investigators`,
        node: (
          <InvestigatorsTab
            componentId={componentId}
            fontScale={fontScale}
            campaign={campaign}
            campaignLog={processedCampaign.campaignLog}
            campaignState={campaignState}
            latestDecks={latestDecks}
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
        ),
      },
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
