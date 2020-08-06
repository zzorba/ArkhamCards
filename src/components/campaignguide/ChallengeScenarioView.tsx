import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { map } from 'lodash';
import { t } from 'ttag';

import SingleCardWrapper from '@components/card/SingleCardWrapper';
import BasicButton from '@components/core/BasicButton';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import { NavigationProps } from '@components/nav/types';
import CampaignGuideContext, { CampaignGuideContextType } from '@components/campaignguide/CampaignGuideContext';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import Card from '@data/Card';
import { Scenario, ChallengeData } from '@data/scenario/types';
import COLORS from '@styles/colors';

export interface ChallengeScenarioProps {
  scenario: Scenario;
  challenge: ChallengeData;
  onPress: (scenario: Scenario) => void;
}

type Props = ChallengeScenarioProps & NavigationProps;

export default class ChallengeScenarioView extends React.Component<Props> {
  static contextType = CampaignGuideContext;
  context!: CampaignGuideContextType;

  _onPress = () => {
    const { componentId, onPress, scenario } = this.props;
    Navigation.pop(componentId);
    onPress(scenario);
  };

  introText(investigator: Card) {
    const { scenario } = this.props;
    return t`The <i>${scenario.scenario_name}</i> challenge scenario centers around the investigator ${investigator.name}, and therefore has the following prerequisites:`;
  }

  render() {
    const {
      challenge,
    } = this.props;
    return (
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <SingleCardWrapper code={challenge.investigator} type="player">
            { investigator => (
              <View>
                <SetupStepWrapper bulletType="none">
                  <CampaignGuideTextComponent text={this.introText(investigator)} />
                </SetupStepWrapper>
                <SetupStepWrapper>
                  <CampaignGuideTextComponent
                    text={t`${investigator.name} must be chosen as one of the investigators when playing this scenario.`}
                  />
                </SetupStepWrapper>
                { map(challenge.requirements, (text, idx) => (
                  <SetupStepWrapper key={idx}>
                    <CampaignGuideTextComponent text={text} />
                  </SetupStepWrapper>
                )) }
              </View>
            ) }
          </SingleCardWrapper>
          <SetupStepWrapper bulletType="none">
            <CampaignGuideTextComponent text={t`The app does not enforce Challenge Scenario prerequisites, so please confirm that they apply manually.`} />
          </SetupStepWrapper>

          <BasicButton title={t`Play this scenario`} onPress={this._onPress} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    paddingBottom: 32,
  },
});
