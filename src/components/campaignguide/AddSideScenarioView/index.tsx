import React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import DialogComponent from 'react-native-dialog';
import { find, flatMap } from 'lodash';
import { t } from 'ttag';

import Dialog from 'components/core/Dialog';
import DialogPlusMinusButtons from 'components/core/DialogPlusMinusButtons';
import BasicButton from 'components/core/BasicButton';
import SideScenarioButton from './SideScenarioButton';
import { NavigationProps } from 'components/nav/types';
import CampaignGuideContext, { CampaignGuideContextType } from 'components/campaignguide/CampaignGuideContext';
import withCampaignGuideContext, { CampaignGuideInputProps, CampaignGuideProps } from 'components/campaignguide/withCampaignGuideContext';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import { ScenarioId } from 'data/scenario';
import { Scenario } from 'data/scenario/types';
import typography from 'styles/typography';
import space from 'styles/space';

export interface AddSideScenarioProps extends CampaignGuideInputProps {
  latestScenarioId: ScenarioId;
}

type Props = NavigationProps & DimensionsProps & AddSideScenarioProps & CampaignGuideProps;

interface State {
  customDialogVisible: boolean;
  viewRef?: View;
  customScenarioName: string;
  customXpCost: number;
}

class AddSideScenarioView extends React.Component<Props, State> {
  static contextType = CampaignGuideContext;
  context!: CampaignGuideContextType;

  state: State = {
    customDialogVisible: false,
    customScenarioName: '',
    customXpCost: 1,
  };

  _onPress = (scenario: Scenario) => {
    const { componentId, latestScenarioId } = this.props;
    this.context.campaignState.startOfficialSideScenario(
      scenario.id,
      latestScenarioId,
    );
    Navigation.pop(componentId);
  };

  _saveCustomScenario = () => {
    const { componentId, latestScenarioId } = this.props;
    const {
      customScenarioName,
      customXpCost,
    } = this.state;
    this.context.campaignState.startCustomSideScenario(
      latestScenarioId,
      customScenarioName,
      customXpCost
    );
    Navigation.pop(componentId);
  };

  _customScenarioPressed = () => {
    this.setState({
      customDialogVisible: true,
    });
  };

  _cancelCustomScenarioPressed = () => {
    this.setState({
      customDialogVisible: false,
    });
  };

  _captureViewRef = (ref: View) => {
    this.setState({
      viewRef: ref,
    });
  };

  _onNameChange = (text: string) => {
    this.setState({
      customScenarioName: text,
    });
  };

  _incXpCost = () => {
    this.setState(state => {
      return {
        customXpCost: state.customXpCost + 1,
      };
    });
  };

  _decXpCost = () => {
    this.setState(state => {
      return {
        customXpCost: Math.max(state.customXpCost - 1, 0),
      };
    });
  };

  renderCustomDialog() {
    const {
      customDialogVisible,
      customScenarioName,
      customXpCost,
      viewRef,
    } = this.state;
    const buttonColor = Platform.OS === 'ios' ? '#007ff9' : '#169689';
    return (
      <Dialog
        title={t`Custom side scenario`}
        visible={customDialogVisible}
        viewRef={viewRef}
      >
        <DialogComponent.Description style={[
          space.paddingTopS,
          typography.dialogLabel,
          typography.left,
        ]}>
          { t`Scenario Name` }
        </DialogComponent.Description>
        <DialogComponent.Input
          value={customScenarioName}
          placeholder={t`Required`}
          onChangeText={this._onNameChange}
        />
        <DialogPlusMinusButtons
          label={t`Experience Cost`}
          value={customXpCost}
          inc={this._incXpCost}
          dec={this._decXpCost}
        />
        <DialogComponent.Button
          label={t`Cancel`}
          onPress={this._cancelCustomScenarioPressed}
        />
        <DialogComponent.Button
          label={t`Add`}
          color={customScenarioName ? buttonColor : '#666666'}
          disabled={!customScenarioName}
          onPress={this._saveCustomScenario}
        />
      </Dialog>
    );
  }

  render() {
    const {
      fontScale,
      campaignData: {
        campaignGuide,
        campaignState,
      },
    } = this.props;
    const processedCampaign = campaignGuide.processAllScenarios(campaignState);
    return (
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          { flatMap(campaignGuide.sideScenarios(), scenario => {
            const alreadyPlayed = !!find(
              processedCampaign.scenarios,
              playedScenario => playedScenario.id.scenarioId === scenario.id
            );
            if (alreadyPlayed) {
              // Already played this one.
              return [];
            }
            return (
              <SideScenarioButton
                key={scenario.id}
                scenario={scenario}
                onPress={this._onPress}
                fontScale={fontScale}
              />
            );
          }) }
          <BasicButton
            title={t`Custom scenario`}
            onPress={this._customScenarioPressed}
          />

        </ScrollView>
        { this.renderCustomDialog() }
      </View>
    );
  }
}

export default withCampaignGuideContext(
  withDimensions(AddSideScenarioView)
);


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollView: {
    paddingBottom: 32,
  },
});
