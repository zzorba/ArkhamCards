import React from 'react';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { t } from 'ttag';

import InvestigatorsTab from './InvestigatorsTab';
import CampaignLogTab from './CampaignLogTab';
import ScenarioListTab from './ScenarioListTab';
import TabView from 'components/core/TabView';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import { CampaignGuideContextType } from '../CampaignGuideContext';
import withCampaignGuideContext, { CampaignGuideInputProps } from '../withCampaignGuideContext';
import { NavigationProps } from 'components/nav/types';

export type CampaignGuideProps = CampaignGuideInputProps;

type Props = CampaignGuideProps & NavigationProps & DimensionsProps;

class CampaignGuideView extends React.Component<Props & CampaignGuideContextType> {
  _navEventListener: EventSubscription;

  constructor(props: Props & CampaignGuideContextType) {
    super(props);

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentDidDisappear() {
    console.log('vanished');
  }

  componentWillUnmount() {
    console.log('dismissed');
    this._navEventListener && this._navEventListener.remove();
  }

  _onTabChange = () => {
  };

  render() {
    const {
      campaignId,
      campaignGuide,
      campaignState,
      fontScale,
      componentId,
      latestDecks,
    } = this.props;
    const processedCampaign = campaignGuide.processAllScenarios(campaignState);
    const tabs = [
      {
        key: 'investigators',
        title: t`Investigators`,
        node: (
          <InvestigatorsTab
            componentId={componentId}
            fontScale={fontScale}
            campaignLog={processedCampaign.campaignLog}
            latestDecks={latestDecks}
          />
        ),
      },
      {
        key: 'scenarios',
        title: t`Scenarios`,
        node: (
          <ScenarioListTab
            campaignId={campaignId}
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
