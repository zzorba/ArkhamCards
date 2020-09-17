import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { EventSubscription, Navigation } from 'react-native-navigation';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { t } from 'ttag';

import CampaignGuideSummary from './CampaignGuideSummary';
import withDialogs, { InjectedDialogProps } from '@components/core/withDialogs';
import { Campaign } from '@actions/types';
import CampaignInvestigatorsComponent from '@components/campaignguide/CampaignInvestigatorsComponent';
import CampaignLogComponent from '@components/campaignguide/CampaignLogComponent';
import ScenarioListComponent from '@components/campaignguide/ScenarioListComponent';
import TabView from '@components/core/TabView';
import { deleteCampaign, updateCampaign } from '@components/campaign/actions';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import withTraumaDialog, { TraumaProps } from '@components/campaign/withTraumaDialog';
import withCampaignGuideContext, {
  CampaignGuideProps as InjectedCampaignGuideProps,
  CampaignGuideInputProps,
} from '@components/campaignguide/withCampaignGuideContext';
import { NavigationProps } from '@components/nav/types';
import { s, m } from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

export type CampaignGuideProps = CampaignGuideInputProps;

interface ReduxActionProps {
  updateCampaign: (
    id: number,
    sparseCampaign: Partial<Campaign>
  ) => void;
  deleteCampaign: (id: number) => void;
}

type Props = CampaignGuideProps &
  ReduxActionProps &
  NavigationProps &
  DimensionsProps &
  InjectedDialogProps &
  InjectedCampaignGuideProps &
  TraumaProps;

class CampaignGuideView extends React.Component<Props> {
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
    const {
      showTextEditDialog,
      campaignData: { campaignName },
    } = this.props;
    showTextEditDialog(t`Name`, campaignName, this._updateCampaignName);
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

  /* eslint-disable @typescript-eslint/no-empty-function */
  _onTabChange = () => {};

  _delete = () => {
    const { componentId, campaignId, deleteCampaign } = this.props;
    deleteCampaign(campaignId);
    Navigation.pop(componentId);
  };

  _deleteCampaign = () => {
    const {
      campaignData: { campaignName },
    } = this.props;
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
      campaignData,
      componentId,
      updateCampaign,
      showTraumaDialog,
    } = this.props;
    const {
      campaignGuide,
      campaignState,
    } = campaignData;
    const { backgroundStyle, borderStyle } = this.context;
    const processedCampaign = campaignGuide.processAllScenarios(campaignState);
    const tabs = [
      {
        key: 'investigators',
        title: t`Decks`,
        node: (
          <ScrollView contentContainerStyle={backgroundStyle}>
            <View style={[styles.section, styles.bottomBorder, borderStyle]}>
              <CampaignGuideSummary
                difficulty={processedCampaign.campaignLog.campaignData.difficulty}
                campaignGuide={campaignGuide}
              />
            </View>
            <CampaignInvestigatorsComponent
              componentId={componentId}
              deleteCampaign={this._deleteCampaign}
              updateCampaign={updateCampaign}
              campaignData={campaignData}
              processedCampaign={processedCampaign}
              showTraumaDialog={showTraumaDialog}
            />
          </ScrollView>
        ),
      },
      {
        key: 'scenarios',
        title: t`Scenarios`,
        node: (
          <ScrollView contentContainerStyle={backgroundStyle}>
            <ScenarioListComponent
              campaignId={campaignId}
              campaignData={campaignData}
              processedCampaign={processedCampaign}
              componentId={componentId}
            />
          </ScrollView>
        ),
      },
      {
        key: 'log',
        title: t`Log`,
        node: (
          <ScrollView contentContainerStyle={styles.container}>
            <CampaignLogComponent
              campaignId={campaignId}
              campaignGuide={campaignGuide}
              campaignLog={processedCampaign.campaignLog}
              componentId={componentId}
            />
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

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    updateCampaign,
    deleteCampaign,
  } as any, dispatch);
}

export default withDimensions(
  withCampaignGuideContext<Props>(
    connect(null, mapDispatchToProps)(
      withDialogs(
        withTraumaDialog(CampaignGuideView, { hideKilledInsane: true })
      )
    )
  )
);

const styles = StyleSheet.create({
  section: {
    padding: m,
    paddingLeft: s + m,
    paddingRight: s + m,
  },
  bottomBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
