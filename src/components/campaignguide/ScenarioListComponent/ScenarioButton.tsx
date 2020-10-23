import React from 'react';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { t } from 'ttag';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { showScenario } from '@components/campaignguide/nav';
import NavButton from '@components/core/NavButton';
import CampaignGuideContext, { CampaignGuideContextType } from '@components/campaignguide/CampaignGuideContext';
import CampaignGuide from '@data/scenario/CampaignGuide';
import { ProcessedScenario } from '@data/scenario';
import space, { s } from '@styles/space';

interface Props {
  componentId: string;
  campaignId: number;
  campaignGuide: CampaignGuide;
  scenario: ProcessedScenario;
  linked: boolean;
  showLinkedScenario?: (
    scenarioId: string
  ) => void;
}

export default class ScenarioButton extends React.Component<Props> {
  static contextType = CampaignGuideContext;
  context!: CampaignGuideContextType;

  name() {
    const { scenario } = this.props;
    const attempt = (scenario.id.replayAttempt || 0) + 1;
    const scenarioName = scenario.scenarioGuide.scenarioType() === 'scenario' ?
      scenario.scenarioGuide.scenarioName() :
      scenario.scenarioGuide.fullScenarioName();
    if (attempt > 1) {
      return t`${scenarioName} (Attempt ${attempt})`;
    }
    return scenarioName;
  }

  _onPress = () => {
    const {
      componentId,
      scenario,
      campaignId,
      campaignGuide,
      linked,
      showLinkedScenario,
    } = this.props;
    showScenario(
      componentId,
      scenario,
      campaignId,
      this.context.campaignState,
      linked ? campaignGuide.campaignName() : undefined,
      showLinkedScenario
    );
  };

  renderIcon() {
    const { scenario } = this.props;
    const {
      style: { fontScale, colors },
    } = this.context;
    const iconSize = 24 * fontScale;
    switch (scenario.type) {
      case 'placeholder':
      case 'locked':
        return (
          <MaterialCommunityIcons
            name="lock"
            size={iconSize}
            color={colors.lightText}
          />
        );
      case 'completed':
        return (
          <MaterialCommunityIcons
            name="checkbox-marked"
            size={iconSize}
            color={colors.navButton}
          />
        );
      case 'started':
        return (
          <MaterialCommunityIcons
            name="checkbox-intermediate"
            size={iconSize}
            color={colors.navButton}
          />
        );
      case 'playable':
        return (
          <MaterialCommunityIcons
            name="checkbox-blank-outline"
            size={iconSize}
            color={colors.navButton}
          />
        );
      case 'skipped':
        return (
          <MaterialCommunityIcons
            name="close-box-outline"
            size={iconSize}
            color={colors.navButton}
          />
        );
    }
  }

  renderContent() {
    const { scenario } = this.props;
    const {
      style: { typography },
    } = this.context;
    switch (scenario.type) {
      case 'locked':
        return (
          <Text style={[typography.gameFont, typography.light]} numberOfLines={2}>
            { this.name() }
          </Text>
        );
      case 'placeholder':
        return (
          <>
            <Text style={[typography.gameFont, typography.light]} numberOfLines={2}>
              { this.name() }
            </Text>
            <Text style={[typography.small, typography.light]} numberOfLines={1}>
              { t`Coming soon` }
            </Text>
          </>
        );
      case 'completed':
        return (
          <Text style={typography.gameFont} numberOfLines={2}>
            { this.name() }
          </Text>
        );
      case 'started':
      case 'playable':
        return (
          <Text style={[typography.gameFont, styles.playable]} numberOfLines={2}>
            { this.name() }
          </Text>
        );
      case 'skipped':
        return (
          <Text style={[typography.gameFont, styles.skipped]} numberOfLines={2}>
            { this.name() }
          </Text>
        );
    }
  }

  render() {
    const { scenario } = this.props;
    return (
      <NavButton
        onPress={this._onPress}
        disabled={(scenario.type === 'locked' || scenario.type === 'skipped' || scenario.type === 'placeholder')}
      >
        <View style={styles.wrapper}>
          <View style={[space.marginLeftS, space.marginRightM]}>
            { this.renderIcon() }
          </View>
          <View style={styles.flex}>
            { this.renderContent() }
          </View>
        </View>
      </NavButton>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  wrapper: {
    paddingTop: s,
    paddingBottom: s,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  skipped: {
    textDecorationLine: 'line-through',
  },
  playable: {
    textDecorationLine: 'underline',
  },
});
