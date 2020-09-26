import React from 'react';
import { Alert, ScrollView } from 'react-native';
import { EventSubscription, Navigation } from 'react-native-navigation';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { t } from 'ttag';

import LinkedScenarioListComponent from './LinkedScenarioListComponent';
import CampaignGuideSummary from './CampaignGuideSummary';
import withDialogs, { InjectedDialogProps } from '@components/core/withDialogs';
import { Campaign } from '@actions/types';
import BasicButton from '@components/core/BasicButton';
import CampaignInvestigatorsComponent from '@components/campaignguide/CampaignInvestigatorsComponent';
import CampaignLogComponent from '@components/campaignguide/CampaignLogComponent';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import withTraumaDialog, { TraumaProps } from '@components/campaign/withTraumaDialog';
import TabView from '@components/core/TabView';
import { deleteCampaign, updateCampaign } from '@components/campaign/actions';
import withUniversalCampaignData, { UniversalCampaignProps } from '@components/campaignguide/withUniversalCampaignData';
import { campaignGuideReduxData, CampaignGuideReduxData, constructCampaignGuideContext } from '@components/campaignguide/contextHelper';
import { getCampaign, AppState } from '@reducers';
import { NavigationProps } from '@components/nav/types';
import COLORS from '@styles/colors';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

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
  InjectedDialogProps &
  TraumaProps;

class LinkedCampaignGuideView extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  _navEventListener!: EventSubscription;
  constructor(props: Props) {
    super(props);
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'edit') {
      this._showEditNameDialog();
    }
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

  _syncCampaignData = () => {
    return;
  };

  /* eslint-disable @typescript-eslint/no-empty-function */
  _onTabChange = () => {};

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
      campaignDataA,
      campaignDataB,
      componentId,
      updateCampaign,
      showTraumaDialog,
    } = this.props;
    const { backgroundStyle } = this.context;
    if (!campaignDataA || !campaignDataB) {
      return null;
    }
    const contextA = constructCampaignGuideContext(
      campaignDataA,
      this.props,
      this.context
    );
    const contextB = constructCampaignGuideContext(
      campaignDataB,
      this.props,
      this.context
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
          <ScrollView contentContainerStyle={backgroundStyle}>
            <CampaignGuideSummary
              difficulty={processedCampaignA.campaignLog.campaignData.difficulty}
              campaignGuide={contextA.campaignGuide}
              inverted
            />
            <CampaignGuideContext.Provider value={contextA}>
              <CampaignInvestigatorsComponent
                componentId={componentId}
                updateCampaign={updateCampaign}
                processedCampaign={processedCampaignA}
                campaignData={contextA}
                showTraumaDialog={showTraumaDialog}
              />
            </CampaignGuideContext.Provider>
            <CampaignGuideSummary
              difficulty={processedCampaignB.campaignLog.campaignData.difficulty}
              campaignGuide={contextB.campaignGuide}
              inverted
            />
            <CampaignGuideContext.Provider value={contextB}>
              <CampaignInvestigatorsComponent
                componentId={componentId}
                updateCampaign={updateCampaign}
                processedCampaign={processedCampaignB}
                campaignData={contextB}
                showTraumaDialog={showTraumaDialog}
              />
            </CampaignGuideContext.Provider>
            <BasicButton
              title={t`Delete Campaign`}
              onPress={this._deleteCampaign}
              color={COLORS.red}
            />
          </ScrollView>
        ),
      },
      {
        key: 'scenarios',
        title: t`Scenarios`,
        node: (
          <ScrollView contentContainerStyle={backgroundStyle}>
            <LinkedScenarioListComponent
              componentId={componentId}
              campaignA={processedCampaignA}
              campaignDataA={contextA}
              campaignB={processedCampaignB}
              campaignDataB={contextB}
            />
          </ScrollView>
        ),
      },
      {
        key: 'log',
        title: t`Log`,
        node: (
          <ScrollView contentContainerStyle={backgroundStyle}>
            <CampaignGuideSummary
              difficulty={processedCampaignA.campaignLog.campaignData.difficulty}
              campaignGuide={contextA.campaignGuide}
              inverted
            />
            <CampaignGuideContext.Provider value={contextA}>
              <CampaignLogComponent
                campaignId={contextA.campaignId}
                campaignGuide={contextA.campaignGuide}
                campaignLog={processedCampaignA.campaignLog}
                componentId={componentId}
              />
            </CampaignGuideContext.Provider>
            <CampaignGuideSummary
              difficulty={processedCampaignB.campaignLog.campaignData.difficulty}
              campaignGuide={contextB.campaignGuide}
              inverted
            />
            <CampaignGuideContext.Provider value={contextB}>
              <CampaignLogComponent
                campaignId={contextB.campaignId}
                campaignGuide={contextB.campaignGuide}
                campaignLog={processedCampaignB.campaignLog}
                componentId={componentId}
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

export default withUniversalCampaignData<LinkedCampaignGuideProps & NavigationProps>(
  connect<ReduxProps, ReduxActionProps, LinkedCampaignGuideProps & NavigationProps & UniversalCampaignProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
  )(
    withDialogs(
      withTraumaDialog(LinkedCampaignGuideView, { hideKilledInsane: true })
    )
  )
);
