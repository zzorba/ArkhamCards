import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { EventSubscription, Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import CampaignGuideContext, { CampaignGuideContextType } from '../CampaignGuideContext';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import StepsComponent from '../StepsComponent';
import withScenarioGuideContext, { ScenarioGuideInputProps } from '../withScenarioGuideContext';
import { iconsMap } from 'app/NavIcons';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import { NavigationProps } from 'components/nav/types';
import { COLORS } from 'styles/colors';

type Props = NavigationProps & ScenarioGuideInputProps & DimensionsProps;

export type ScenarioProps = ScenarioGuideInputProps;

class ScenarioView extends React.Component<Props> {
  static contextType = CampaignGuideContext;
  context!: CampaignGuideContextType;

  static get options() {
    return {
      topBar: {
        rightButtons: [{
          icon: iconsMap.replay,
          id: 'reset',
          color: COLORS.navButton,
        }, {
          icon: iconsMap.undo,
          id: 'undo',
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
    if (buttonId === 'undo') {
      this.undoPressed();
    }
  }

  undoPressed() {
    const { scenarioId } = this.props;
    this.context.campaignState.undo(scenarioId);
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
          this.context.campaignState.resetScenario(this.props.scenarioId);
        },
      }]
    );
  }

  render() {
    const { componentId, fontScale } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioGuide, scenarioState }: ScenarioGuideContextType) => {
          return (
            <ScrollView>
              <StepsComponent
                componentId={componentId}
                fontScale={fontScale}
                steps={scenarioGuide.setupSteps(scenarioState).steps}
              />
              <View style={styles.footer} />
            </ScrollView>
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}

export default withScenarioGuideContext<Props>(
  withDimensions<Props>(ScenarioView)
);

const styles = StyleSheet.create({
  footer: {
    marginTop: 64,
  },
});
