import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { EventSubscription, Navigation } from 'react-native-navigation';
import { flatMap } from 'lodash';
import { t } from 'ttag';

import ChooseInvestigatorPrompt from '../prompts/ChooseInvestigatorPrompt';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import StepsComponent from '../StepsComponent';
import ResolutionButton from './ResolutionButton';
import withCampaignDataContext, { CampaignDataInputProps } from '../withCampaignDataContext';
import { iconsMap } from 'app/NavIcons';
import { NavigationProps } from 'components/nav/types';
import ScenarioGuide from 'data/scenario/ScenarioGuide';
import typography from 'styles/typography';
import { COLORS } from 'styles/colors';

type Props = NavigationProps;

export type ScenarioProps = CampaignDataInputProps;

class ScenarioView extends React.Component<Props> {
  static contextType = ScenarioGuideContext;
  context!: ScenarioGuideContextType;

  static get options() {
    return {
      topBar: {
        rightButtons: [{
          icon: iconsMap.replay,
          id: 'reset',
          color: COLORS.navButton,
        }],
      },
    };
  }
  _navEventListener: EventSubscription;

  constructor(props: Props) {
    super(props);

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener.remove();
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'reset') {
      this.resetPressed();
    }
  }

  resetPressed() {
    Alert.alert(
      t`Reset Scenario?`,
      t`Are you sure you want to reset this scenario?\n\nAll data you have entered will be lost.`,
      [{
        text: t`Nevermind`,
      }, {
        text: t`Reset`,
        style: 'destructive',
        onPress: () => {
          this.context.scenarioState.resetScenario();
        },
      }]
    );
  }

  renderResolutions(scenarioGuide: ScenarioGuide) {
    const { componentId } = this.props;
    if (!scenarioGuide.scenario.resolutions) {
      return null;
    }
    return (
      <View style={styles.resolution}>
        <View style={styles.wrapper}>
          <Text style={[typography.bigGameFont, typography.center]}>
            { t`Resolutions` }
          </Text>
          <Text style={[typography.gameFont, typography.center]}>
            { t`DO NOT READ until the end of the scenario` }
          </Text>
        </View>
        { flatMap(scenarioGuide.scenario.resolutions, (resolution, idx) => (
          resolution.id === 'investigator_defeat' ? null : (
            <ResolutionButton
              key={idx}
              componentId={componentId}
              resolution={resolution}
            />
          ))
        ) }
      </View>
    );
  }

  render() {
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioGuide, scenarioState }: ScenarioGuideContextType) => {
          const interlude = !!scenarioGuide.scenario.interlude;
          return (
            <ScrollView>
              { !interlude && (
                <ChooseInvestigatorPrompt
                  id={scenarioGuide.scenario.id}
                  title={t`Lead Investigator`}
                  required
                />
              ) }
              { (interlude || scenarioState.hasChoice(`${scenarioGuide.scenario.id}_investigator`)) && (
                <>
                  <StepsComponent
                    steps={scenarioGuide.setupSteps(scenarioState)}
                  />
                  { this.renderResolutions(scenarioGuide) }
                </>
              ) }
            </ScrollView>
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}

export default withCampaignDataContext<Props>(
  ScenarioView
);

const styles = StyleSheet.create({
  wrapper: {
    marginLeft: 16,
    marginRight: 16,
  },
  resolution: {
  },
});
