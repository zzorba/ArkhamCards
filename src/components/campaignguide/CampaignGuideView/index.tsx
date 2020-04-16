import React from 'react';
import { Alert, InteractionManager } from 'react-native';
import { flatMap, forEach } from 'lodash';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { t } from 'ttag';

import withDialogs, { InjectedDialogProps } from 'components/core/withDialogs';
import { Campaign, InvestigatorData } from 'actions/types';
import InvestigatorsTab from './InvestigatorsTab';
import CampaignLogComponent from '../CampaignLogComponent';
import ScenarioListTab from './ScenarioListTab';
import TabView from 'components/core/TabView';
import { deleteCampaign, updateCampaign } from 'components/campaign/actions';
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
  deleteCampaign: (id: number) => void;
}
type Props = CampaignGuideProps & ReduxActionProps & NavigationProps & DimensionsProps & InjectedDialogProps;

interface State {
  firstAppearance: boolean;
  spentXp: {
    [code: string]: number;
  };
  dirty: boolean;
}

class CampaignGuideView extends React.Component<Props & CampaignGuideContextType, State> {
  _navEventListener: EventSubscription;

  constructor(props: Props & CampaignGuideContextType) {
    super(props);

    const spentXp: {
      [code: string]: number;
    } = {};
    forEach(props.adjustedInvestigatorData, (data, code) => {
      spentXp[code] = (data && data.spentXp) || 0;
    });

    this.state = {
      firstAppearance: true,
      spentXp,
      dirty: false,
    };
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
    InteractionManager.runAfterInteractions(() => {
      this._syncCampaignData();
    });
  }

  _showEditNameDialog = () => {
    const { showTextEditDialog, campaignName } = this.props;
    showTextEditDialog(
      t`Name`,
      campaignName,
      this._updateCampaignName
    );
  }

  _updateCampaignName = (name: string) => {
    const { campaignId, componentId, updateCampaign } = this.props;
    updateCampaign(campaignId, { name, lastUpdated: new Date() });
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: name,
        },
      },
    });
  };

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'edit') {
      this._showEditNameDialog();
    }
  }

  _syncCampaignData = () => {
    const {
      campaignId,
      campaignGuide,
      campaignState,
      updateCampaign,
    } = this.props;
    const { spentXp } = this.state;
    const {
      campaignLog,
      scenarios,
    } = campaignGuide.processAllScenarios(campaignState);
    const adjustedInvestigatorData: InvestigatorData = {};
    forEach(spentXp, (xp, code) => {
      adjustedInvestigatorData[code] = {
        spentXp: xp,
      };
    });
    updateCampaign(
      campaignId,
      {
        guideVersion: campaignGuide.campaignVersion(),
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
        adjustedInvestigatorData,
      }
    );
  };

  _onTabChange = () => {
  };

  _incXp = (code: string) => {
    this.setState({
      spentXp: {
        ...this.state.spentXp,
        [code]: (this.state.spentXp[code] || 0) + 1,
      },
      dirty: true,
    });
  };

  _decXp = (code: string) => {
    this.setState({
      spentXp: {
        ...this.state.spentXp,
        [code]: Math.max(0, (this.state.spentXp[code] || 0) - 1),
      },
      dirty: true,
    });
  };

  _delete = () => {
    const { componentId, campaignId, deleteCampaign } = this.props;
    deleteCampaign(campaignId);
    Navigation.pop(componentId);
  };

  _deleteCampaign = () => {
    const { campaignName } = this.props;
    Alert.alert(
      t`Delete`,
      t`Are you sure you want to delete the campaign: ${campaignName}`,
      [
        { text: t`Delete`, onPress: this._delete, style: 'destructive' },
        { text: t`Cancel`, style: 'cancel' },
      ],
    );
  };

  render() {
    const {
      campaignId,
      campaignGuide,
      campaignState,
      fontScale,
      componentId,
      latestDecks,
      playerCards,
    } = this.props;
    const { spentXp } = this.state;
    const processedCampaign = campaignGuide.processAllScenarios(campaignState);
    const tabs = [
      {
        key: 'investigators',
        title: t`Decks`,
        node: (
          <InvestigatorsTab
            componentId={componentId}
            fontScale={fontScale}
            deleteCampaign={this._deleteCampaign}
            campaignLog={processedCampaign.campaignLog}
            campaignGuide={campaignGuide}
            latestDecks={latestDecks}
            spentXp={spentXp}
            incSpentXp={this._incXp}
            decSpentXp={this._decXp}
            playerCards={playerCards}
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
        title: t`Log`,
        node: (
          <CampaignLogComponent
            campaignId={campaignId}
            campaignGuide={campaignGuide}
            campaignLog={processedCampaign.campaignLog}
            componentId={componentId}
            fontScale={fontScale}
          />
        ),
      },
    ];

    return (
      <TabView
        tabs={tabs}
        onTabChange={this._onTabChange}
        fontScale={fontScale}
      />
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    updateCampaign,
    deleteCampaign,
  } as any, dispatch);
}

export default withDimensions(
  withCampaignGuideContext<Props>(
    connect(null, mapDispatchToProps)(
      withDialogs(CampaignGuideView)
    )
  )
);
