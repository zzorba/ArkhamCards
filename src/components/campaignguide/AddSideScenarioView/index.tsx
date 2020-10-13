import React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import DialogComponent from '@lib/react-native-dialog';
import { find, flatMap } from 'lodash';
import { t } from 'ttag';

import Dialog from '@components/core/Dialog';
import DialogPlusMinusButtons from '@components/core/DialogPlusMinusButtons';
import BasicButton from '@components/core/BasicButton';
import SideScenarioButton from './SideScenarioButton';
import { NavigationProps } from '@components/nav/types';
import CampaignGuideContext, { CampaignGuideContextType } from '@components/campaignguide/CampaignGuideContext';
import withCampaignGuideContext, { CampaignGuideInputProps, CampaignGuideProps } from '@components/campaignguide/withCampaignGuideContext';
import TabView from '@components/core/TabView';
import { ScenarioId } from '@data/scenario';
import { Scenario } from '@data/scenario/types';
import space from '@styles/space';
import SetupStepWrapper from '../SetupStepWrapper';
import DownloadParallelCardsButton from './DownloadParallelCardsButton';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import StyleContext from '@styles/StyleContext';

export interface AddSideScenarioProps extends CampaignGuideInputProps {
  latestScenarioId: ScenarioId;
}

type Props = NavigationProps & AddSideScenarioProps & CampaignGuideProps;

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
      customXpCost,
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
    const {
      style: { typography },
    } = this.context;
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

  /* eslint-disable @typescript-eslint/no-empty-function */
  _onTabChange = () => {};

  render() {
    const {
      componentId,
      campaignData: {
        campaignGuide,
        campaignState,
      },
    } = this.props;
    return (
      <StyleContext.Consumer>
        { ({ backgroundStyle, borderStyle }) => {
          const processedCampaign = campaignGuide.processAllScenarios(campaignState);
          const tabs = [
            {
              key: 'scenarios',
              title: t`Side`,
              node: (
                <ScrollView contentContainerStyle={[styles.scrollView, backgroundStyle]}>
                  <View style={[styles.header, borderStyle]}>
                    <SetupStepWrapper bulletType="none">
                      <CampaignGuideTextComponent
                        text={t`A side-story is a scenario that may be played between any two scenarios of an <i>Arkham Horror: The Card Game</i> campaign. Playing a side-story costs each investigator in the campaign a certain amount of experience. Weaknesses, trauma, experience, and rewards granted by playing a side-story stay with the investigators for the remainder of the campaign. Each sidestory may only be played once per campaign.\nThe experience required to play these scenarios will be deducted automatically at the end of the scenario.`} />
                    </SetupStepWrapper>
                  </View>
                  { flatMap(campaignGuide.sideScenarios(), scenario => {
                    if (scenario.side_scenario_type === 'challenge') {
                      return null;
                    }
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
                        componentId={componentId}
                        scenario={scenario}
                        onPress={this._onPress}
                      />
                    );
                  }) }
                  <BasicButton
                    title={t`Custom scenario`}
                    onPress={this._customScenarioPressed}
                  />
                </ScrollView>
              ),
            },
            {
              key: 'challenge',
              title: t`Challenge`,
              node: (
                <ScrollView contentContainerStyle={[styles.scrollView, backgroundStyle]}>
                  <View style={[styles.header, borderStyle]}>
                    <SetupStepWrapper bulletType="none">
                      <CampaignGuideTextComponent text={t`Challenge scenarios are special print-and-play scenarios that utilize existing products in the <i>Arkham Horror: The Card Game</i> collection, along with additional print-and-play cards, to create new content. These scenarios are designed with certain prerequisites in mind, in order to craft a challenging puzzle-like experience. Printable cards can be downloaded from Fantasy Flight Games under the \"Parallel Investigators\" section.`} />
                    </SetupStepWrapper>
                    <DownloadParallelCardsButton />
                  </View>
                  { flatMap(campaignGuide.sideScenarios(), scenario => {
                    if (scenario.side_scenario_type !== 'challenge') {
                      return null;
                    }
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
                        componentId={componentId}
                        scenario={scenario}
                        onPress={this._onPress}
                      />
                    );
                  }) }
                </ScrollView>
              ),
            },
          ];
          return (
            <>
              <TabView
                tabs={tabs}
                onTabChange={this._onTabChange}
              />
              { this.renderCustomDialog() }
            </>
          );
        } }
      </StyleContext.Consumer>
    );
  }
}

export default withCampaignGuideContext(AddSideScenarioView);


const styles = StyleSheet.create({
  scrollView: {
    paddingBottom: 32,
  },
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
