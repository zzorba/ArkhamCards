import React from 'react';
import { Alert, InteractionManager, ScrollView } from 'react-native';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { t } from 'ttag';

import withDialogs, { InjectedDialogProps } from 'components/core/withDialogs';
import { Campaign } from 'actions/types';
import CampaignInvestigatorsComponent from 'components/campaignguide/CampaignInvestigatorsComponent';
import CampaignLogComponent from 'components/campaignguide/CampaignLogComponent';
import ScenarioListComponent from 'components/campaignguide/ScenarioListComponent';
import CampaignGuideContext from 'components/campaignguide/CampaignGuideContext';
import TabView from 'components/core/TabView';
import { deleteCampaign, updateCampaign } from 'components/campaign/actions';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import withUniversalCampaignData, { UniversalCampaignProps } from 'components/campaignguide/withUniversalCampaignData';
import { campaignGuideReduxData, CampaignGuideReduxData, constructCampaignGuideContext } from 'components/campaignguide/contextHelper';
import { getCampaign, AppState } from 'reducers';
import { NavigationProps } from 'components/nav/types';

export interface LinkedCampaignGuideProps {
  campaignId: number;
  campaignIdA: number;
  campaignIdB: number;
}

interface ReduxProps {
  campaignName: string;
  campaignDataA?: CampaignGuideReduxData;
  campaignDataB?: CampaignGuideReduxData;
}

interface ReduxActionProps {
  updateCampaign: (
    id: number,
    sparseCampaign: Partial<Campaign>
  ) => void;
  deleteCampaign: (id: number) => void;
}
type Props = LinkedCampaignGuideProps &
  UniversalCampaignProps &
  ReduxProps &
  ReduxActionProps &
  NavigationProps &
  DimensionsProps &
  InjectedDialogProps;

class LinkedCampaignGuideView extends React.Component<Props> {
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
    return;
  };

  _onTabChange = () => {
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
      campaignDataA,
      campaignDataB,
      fontScale,
      componentId,
      updateCampaign,
    } = this.props;
    if (!campaignDataA || !campaignDataB) {
      return null;
    }
    const contextA = constructCampaignGuideContext(
      campaignDataA,
      this.props,
      campaignDataB.campaignState
    );
    const contextB = constructCampaignGuideContext(
      campaignDataB,
      this.props,
      campaignDataA.campaignState
    );
    const processedCampaignA = contextA.campaignGuide.processAllScenarios(
      contextA.campaignState
    );
    const processedCampaignB = contextB.campaignGuide.processAllScenarios(
      contextB.campaignState
    );

    const tabs = [
      {
        key: 'investigators',
        title: t`Decks`,
        node: (
          <ScrollView>
            <CampaignGuideContext.Provider value={contextA}>
              <CampaignInvestigatorsComponent
                componentId={componentId}
                fontScale={fontScale}
                deleteCampaign={this._deleteCampaign}
                updateCampaign={updateCampaign}
                campaignLog={processedCampaignA.campaignLog}
                campaignData={contextA}
              />
            </CampaignGuideContext.Provider>
            <CampaignGuideContext.Provider value={contextB}>
              <CampaignInvestigatorsComponent
                componentId={componentId}
                fontScale={fontScale}
                deleteCampaign={this._deleteCampaign}
                updateCampaign={updateCampaign}
                campaignLog={processedCampaignB.campaignLog}
                campaignData={contextB}
              />
            </CampaignGuideContext.Provider>
          </ScrollView>
        ),
      },
      {
        key: 'scenarios',
        title: t`Scenarios`,
        node: (
          <ScrollView>
            <CampaignGuideContext.Provider value={contextA}>
              <ScenarioListComponent
                campaignId={campaignDataA.campaign.id}
                processedCampaign={processedCampaignA}
                fontScale={fontScale}
                componentId={componentId}
              />
            </CampaignGuideContext.Provider>
            <CampaignGuideContext.Provider value={contextB}>
              <ScenarioListComponent
                campaignId={campaignDataB.campaign.id}
                processedCampaign={processedCampaignB}
                fontScale={fontScale}
                componentId={componentId}
              />
            </CampaignGuideContext.Provider>
          </ScrollView>
        ),
      },
      {
        key: 'log',
        title: t`Log`,
        node: (
          <ScrollView>
            <CampaignGuideContext.Provider value={contextA}>
              <CampaignLogComponent
                campaignId={contextA.campaignId}
                campaignGuide={contextA.campaignGuide}
                campaignLog={processedCampaignA.campaignLog}
                componentId={componentId}
                fontScale={fontScale}
              />
            </CampaignGuideContext.Provider>
            <CampaignGuideContext.Provider value={contextB}>
              <CampaignLogComponent
                campaignId={contextB.campaignId}
                campaignGuide={contextB.campaignGuide}
                campaignLog={processedCampaignB.campaignLog}
                componentId={componentId}
                fontScale={fontScale}
              />
            </CampaignGuideContext.Provider>
          </ScrollView>
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

function mapStateToProps(
  state: AppState,
  props: LinkedCampaignGuideProps & NavigationProps & UniversalCampaignProps
): ReduxProps {
  const campaign = getCampaign(
    state,
    props.campaignId
  );
  return {
    campaignName: (campaign && campaign.name) || '',
    campaignDataA: campaignGuideReduxData(
      props.campaignIdA,
      props.investigators,
      state
    ),
    campaignDataB: campaignGuideReduxData(
      props.campaignIdB,
      props.investigators,
      state
    ),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    updateCampaign,
    deleteCampaign,
  } as any, dispatch);
}

export default withDimensions<LinkedCampaignGuideProps & NavigationProps>(
  withUniversalCampaignData<LinkedCampaignGuideProps & NavigationProps & DimensionsProps>(
    connect<ReduxProps, ReduxActionProps, LinkedCampaignGuideProps & NavigationProps & UniversalCampaignProps, AppState>(
      mapStateToProps,
      mapDispatchToProps
    )(
      withDialogs(
        LinkedCampaignGuideView
      )
    )
  )
);
