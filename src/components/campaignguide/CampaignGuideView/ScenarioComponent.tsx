import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { flatMap } from 'lodash';
import { t } from 'ttag';

import withCampaignDataContext from '../withCampaignDataContext';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import StepsComponent from '../StepsComponent';
import ScenarioStateHelper from '../ScenarioStateHelper';
import ResolutionComponent from '../ResolutionComponent';
import ScenarioGuide from 'data/scenario/ScenarioGuide';
import typography from 'styles/typography';

interface State {
  currentStep: string;
}

type Props = {};
class ScenarioComponent extends React.Component<Props, State> {
  static contextType = ScenarioGuideContext;

  constructor(props: Props, context: ScenarioGuideContextType) {
    super(props, context);

    this.state = {
      currentStep: context.scenarioGuide.scenario.setup[0],
    };
  }

  renderResolutions(scenarioGuide: ScenarioGuide) {
    if (!scenarioGuide.scenario.resolutions) {
      return null;
    }
    return (
      <View style={styles.resolution}>
        <View style={styles.wrapper}>
          <Text style={[typography.bigGameFont, typography.center]}>
            {t`Resolutions`}
          </Text>
          <Text style={[typography.gameFont, typography.center]}>
            {t`DO NOT READ until the end of the scenario`}
          </Text>
        </View>
        { flatMap(scenarioGuide.scenario.resolutions, (resolution, idx) => (
          resolution.id === 'investigator_defeat' ? null : (
          <ResolutionComponent
            key={idx}
            resolution={resolution}
          />
        ))) }
      </View>
    );
  }

  render() {
    return (
      <ScenarioGuideContext.Consumer>
        {({ scenarioGuide }: ScenarioGuideContextType) => (
          <View>
            <StepsComponent
              steps={scenarioGuide.scenario.setup}
            />
            { this.renderResolutions(scenarioGuide) }
          </View>
        )}
      </ScenarioGuideContext.Consumer>
    );
  }
}

export default withCampaignDataContext<Props>(ScenarioComponent);

const styles = StyleSheet.create({
  wrapper: {
    marginLeft: 16,
    marginRight: 16,
  },
  resolution: {
  },
});
