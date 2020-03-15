import React from 'react';
import {
  Button,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { t} from 'ttag';

import StepsComponent from './StepsComponent';
import ScenarioStateHelper from './ScenarioStateHelper';
import BinaryPrompt from './ScenarioStepComponent/prompts/BinaryPrompt';
import CardFlavorTextComponent from 'components/card/CardFlavorTextComponent';
import CampaignGuide from 'data/scenario/CampaignGuide';
import { getCampaignGuide } from 'data/scenario';
import ScenarioGuide from 'data/scenario/ScenarioGuide';
import { Resolution } from 'data/scenario/types';
import typography from 'styles/typography';

interface ResolutionViewProps {
  campaignCycle: string;
  scenarioId: string;
  resolutionId: string;
}

type Props = ResolutionViewProps

export default class ResolutionView extends React.Component<Props> {
  render() {
    const { campaignCycle, scenarioId, resolutionId } = this.props;
    const guide = getCampaignGuide(campaignCycle);
    if (!guide) {
      return null;
    }
    const scenario = guide.getScenario(scenarioId);
    if (!scenario) {
      return null;
    }
    const investigatorDefeatResolution = scenario.resolution('investigator_defeat');
    if (investigatorDefeatResolution && !scenarioState
    const resolution = scenario.resolution(resolutionId);

    return (
      <View>
        <View style={styles.wrapper}>
          <Text style={typography.mediumGameFont}>
            {resolution.title}
          </Text>
        </View>
        { !secondary && !!defeatResolution && (
          <BinaryPrompt
            id="investigator_defeat_resolution"
            text={t`Were any investigators defeated?`}
            trueResult={{
              text: t`The defeated investigators must read <b>Investigator Defeat</b> first`,
              resolution: 'investigator_defeat',
            }}
            guide={guide}
            scenario={scenario}
            scenarioState={scenarioState}
          />
        ) }
        { !!resolution.text && (
          <View style={styles.wrapper}>
            <CardFlavorTextComponent
              text={resolution.text.replace(/\n/g, '\n\n')}
            />
          </View>
        ) }
        { this.renderSteps() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    marginLeft: 16,
    marginRight: 16,
  },
})
