import React, { useCallback, useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { map } from 'lodash';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import { NavigationProps } from '@components/nav/types';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import Card from '@data/types/Card';
import { Scenario, ChallengeData } from '@data/scenario/types';
import StyleContext from '@styles/StyleContext';
import useSingleCard from '@components/card/useSingleCard';

export interface ChallengeScenarioProps {
  scenario: Scenario;
  challenge: ChallengeData;
  onPress: (scenario: Scenario) => void;
}

type Props = ChallengeScenarioProps & NavigationProps;

export default function ChallengeScenarioView({ componentId, scenario, challenge, onPress }: Props) {
  const { backgroundStyle } = useContext(StyleContext);
  const handleOnPress = useCallback(() => {
    Navigation.pop(componentId);
    onPress(scenario);
  }, [componentId, onPress, scenario]);

  const introText = useCallback((investigator: Card) => {
    return t`The <i>${scenario.scenario_name}</i> challenge scenario centers around the investigator ${investigator.name}, and therefore has the following prerequisites:`;
  }, [scenario]);
  const [investigator] = useSingleCard(challenge.investigator, 'player');
  return (
    <View style={[styles.wrapper, backgroundStyle]}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        { !!investigator && (
          <View>
            <SetupStepWrapper bulletType="none">
              <CampaignGuideTextComponent text={introText(investigator)} />
            </SetupStepWrapper>
            <SetupStepWrapper>
              <CampaignGuideTextComponent
                text={t`${investigator.name} must be chosen as one of the investigators when playing this scenario.`}
              />
            </SetupStepWrapper>
            { map(challenge.requirements, (req, idx) => (
              <SetupStepWrapper key={idx}>
                <CampaignGuideTextComponent text={req.text} />
              </SetupStepWrapper>
            )) }
          </View>
        ) }
        <SetupStepWrapper bulletType="none">
          <CampaignGuideTextComponent text={t`The app does not enforce Challenge Scenario prerequisites, so please confirm that they apply manually.`} />
        </SetupStepWrapper>

        <BasicButton title={t`Play this scenario`} onPress={handleOnPress} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollView: {
    paddingBottom: 32,
  },
});
