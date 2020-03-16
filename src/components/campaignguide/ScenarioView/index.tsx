import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { flatMap } from 'lodash';
import { t } from 'ttag';

import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import StepsComponent from '../StepsComponent';
import ResolutionButton from './ResolutionButton';
import withCampaignDataContext, { CampaignDataInputProps } from '../withCampaignDataContext';
import { NavigationProps } from 'components/nav/types';
import ScenarioGuide from 'data/scenario/ScenarioGuide';
import typography from 'styles/typography';

type Props = NavigationProps;

export type ScenarioProps = CampaignDataInputProps;

class ScenarioView extends React.Component<Props> {
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
        { ({ scenarioGuide }: ScenarioGuideContextType) => {
          return (
            <ScrollView>
              <StepsComponent
                steps={scenarioGuide.scenario.setup}
              />
              { this.renderResolutions(scenarioGuide) }
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
