import React from 'react';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import NavButton from 'components/core/NavButton';
import CampaignGuideContext, { CampaignGuideContextType } from 'components/campaignguide/CampaignGuideContext';
import { ScenarioProps } from 'components/campaignguide/ScenarioView';
import { ProcessedScenario } from 'data/scenario';
import { COLORS } from 'styles/colors';
import typography from 'styles/typography';

interface State {
  currentStep: string;
}

interface Props {
  componentId: string;
  campaignId: number;
  scenario: ProcessedScenario;
  fontScale: number;
}

export default class ScenarioButton extends React.Component<Props, State> {
  static contextType = CampaignGuideContext;
  context!: CampaignGuideContextType;

  name() {
    const { scenario } = this.props;
    if (scenario.attempt > 0) {
      return t`${scenario.scenarioGuide.scenarioName()} (Attempt ${scenario.attempt + 1})`;
    }
    return scenario.scenarioGuide.scenarioName();
  }

  _onPress = () => {
    const { componentId, scenario, campaignId } = this.props;
    const scenarioId = scenario.scenarioGuide.id;
    if (scenario.type === 'playable') {
      this.context.campaignState.startScenario(scenarioId);
    }
    Navigation.push<ScenarioProps>(componentId, {
      component: {
        name: 'Guide.Scenario',
        passProps: {
          campaignId,
          scenarioId,
        },
        options: {
          topBar: {
            title: {
              text: this.name(),
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  };

  renderIcon() {
    const { scenario, fontScale } = this.props;
    const iconSize = 24 * fontScale;
    switch (scenario.type) {
      case 'locked':
        return (
          <MaterialCommunityIcons name="lock" size={iconSize} color="#222" />
        );
      case 'completed':
        return (
          <MaterialCommunityIcons
            name="checkbox-marked"
            size={iconSize}
            color={COLORS.lightBlue}
          />
        );
      case 'started':
        return (
          <MaterialCommunityIcons
            name="checkbox-intermediate"
            size={iconSize}
            color={COLORS.lightBlue}
          />
        );
      case 'playable':
        return (
          <MaterialCommunityIcons
            name="checkbox-blank-outline"
            size={iconSize}
            color={COLORS.lightBlue}
          />
        );
      case 'skipped':
        return (
          <MaterialCommunityIcons
            name="close-box-outline"
            size={iconSize}
            color={COLORS.darkGray}
          />
        );
    }
  }

  renderContent() {
    const { scenario } = this.props;
    switch (scenario.type) {
      case 'locked':
        return (
          <Text style={[typography.gameFont]}>
            { this.name() }
          </Text>
        );
      case 'started':
      case 'completed':
      case 'playable':
        return (
          <>
            <Text style={[typography.gameFont, styles.playable]}>
              { this.name() }
            </Text>
          </>
        );
      case 'skipped':
        return (
          <Text style={[typography.gameFont, styles.skipped]}>
            { this.name() }
          </Text>
        );
    }
  }

  render() {
    const { scenario, fontScale } = this.props;
    return (
      <NavButton
        fontScale={fontScale}
        onPress={this._onPress}
        disabled={(scenario.type === 'locked' || scenario.type === 'skipped')}
      >
        <View style={styles.wrapper}>
          <View style={styles.icon}>
            { this.renderIcon() }
          </View>
          { this.renderContent() }
        </View>
      </NavButton>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  skipped: {
    textDecorationLine: 'line-through',
  },
  icon: {
    marginLeft: 8,
    marginRight: 16,
  },
  playable: {
    color: COLORS.lightBlue,
  },
});
