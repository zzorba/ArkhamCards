import React, { useCallback, useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { map } from 'lodash';
import { t } from 'ttag';

import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import Card from '@data/types/Card';
import { Scenario, ChallengeData } from '@data/scenario/types';
import StyleContext from '@styles/StyleContext';
import useSingleCard from '@components/card/useSingleCard';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BasicStackParamList } from '@navigation/types';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import HeaderTitle from '@components/core/HeaderTitle';
import DeckButton from '@components/deck/controls/DeckButton';
import space from '@styles/space';

export interface ChallengeScenarioProps {
  scenario: Scenario;
  challenge: ChallengeData;
  onPress: (scenario: Scenario) => void;
  title: string;
}

export default function ChallengeScenarioView() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Guide.ChallengeScenario'>>();
  const { scenario, challenge, onPress } = route.params;
  const navigation = useNavigation();
  const { backgroundStyle } = useContext(StyleContext);
  const handleOnPress = useCallback(() => {
    navigation.goBack();
    onPress(scenario);
  }, [navigation, onPress, scenario]);

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
        <View style={space.marginSideM}>
          <DeckButton encounterIcon={scenario.id} title={t`Play this scenario`} onPress={handleOnPress} />
        </View>
      </ScrollView>
    </View>
  );
}

function options<T extends BasicStackParamList>({ route }: { route: RouteProp<T, 'Guide.ChallengeScenario'> }): NativeStackNavigationOptions {
  return {
    headerTitle: () => <HeaderTitle title={route.params?.scenario.scenario_name ?? ''} subtitle={t`Challenge Scenario`} />,
    headerBackTitle: t`Cancel`,
  };
};
ChallengeScenarioView.options = options;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollView: {
    paddingBottom: 32,
  },
});
