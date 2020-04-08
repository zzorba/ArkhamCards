import React from 'react';
import { flatMap } from 'lodash';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { t } from 'ttag';

import { Campaign } from 'actions/types';
import InvestigatorsTab from './InvestigatorsTab';
import CampaignLogTab from './CampaignLogTab';
import ScenarioListTab from './ScenarioListTab';
import TabView from 'components/core/TabView';
import { updateCampaign } from 'components/campaign/actions';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import { CampaignGuideContextType } from '../CampaignGuideContext';
import withCampaignGuideContext, { CampaignGuideInputProps } from '../withCampaignGuideContext';
import { NavigationProps } from 'components/nav/types';

export type CampaignGuideProps = CampaignGuideInputProps;

interface ReduxActionProps {
  updateCampaign: (
    id: number,
    sparseCampaign: Partial<Campaign>
  ) => void;
}
type Props = CampaignGuideProps & ReduxActionProps & NavigationProps & DimensionsProps;
interface State {
  firstAppearance: boolean;
}

class CampaignGuideView extends React.Component<Props & CampaignGuideContextType, State> {
  _navEventListener: EventSubscription;
  state: State = {
    firstAppearance: true,
  };

  constructor(props: Props & CampaignGuideContextType) {
    super(props);

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  componentDidAppear() {
    if (this.state.firstAppearance) {
      this.setState({
        firstAppearance: false,
      });
      return;
    }
    const {
      campaignId,
      campaignGuide,
      campaignState,
      updateCampaign,
    } = this.props;
    const {
      campaignLog,
      scenarios,
    } = campaignGuide.processAllScenarios(campaignState);
    updateCampaign(
      campaignId,
      {
        difficulty: campaignLog.campaignData.difficulty,
        investigatorData: campaignLog.campaignData.investigatorData,
        chaosBag: campaignLog.chaosBag,
        lastUpdated: new Date(),
        scenarioResults: flatMap(scenarios, scenario => {
          if (scenario.type !== 'completed') {
            return [];
          }
          const scenarioType = scenario.scenarioGuide.scenarioType();
          return {
            scenario: scenario.scenarioGuide.scenarioName(),
            scenarioCode: scenario.scenarioGuide.scenarioId(),
            resolution: campaignLog.scenarioResolution(scenario.scenarioGuide.scenarioId()) || '',
            interlude: scenarioType === 'interlude' || scenarioType === 'epilogue',
          };
        }),
      }
    );
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

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    updateCampaign,
  } as any, dispatch);
}

export default withDimensions(
  withCampaignGuideContext<Props>(
    connect(null, mapDispatchToProps)(CampaignGuideView)
  )
);
