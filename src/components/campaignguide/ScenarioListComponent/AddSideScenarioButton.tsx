import React from 'react';
import { Text, View } from 'react-native';
import { find, findLast, findLastIndex } from 'lodash';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import { AddSideScenarioProps } from '@components/campaignguide/AddSideScenarioView';
import { ProcessedCampaign } from '@data/scenario';
import CampaignGuide from '@data/scenario/CampaignGuide';
import CampaignStateHelper from '@data/scenario/CampaignStateHelper';
import typography from '@styles/typography';
import space from '@styles/space';

interface Props {
  componentId: string;
  campaignId: number;
  processedCampaign: ProcessedCampaign;
  campaignGuide: CampaignGuide;
  campaignState: CampaignStateHelper;
}

export default class AddSideScenarioButton extends React.Component<Props> {
  _onPress = () => {
    const {
      componentId,
      campaignId,
      processedCampaign: {
        scenarios,
      },
    } = this.props;
    const lastCompletedScenario = findLast(
      scenarios,
      scenario => scenario.type === 'completed'
    );
    if (!lastCompletedScenario) {
      return null;
    }
    Navigation.push<AddSideScenarioProps>(componentId, {
      component: {
        name: 'Guide.SideScenario',
        passProps: {
          campaignId,
          latestScenarioId: lastCompletedScenario.id,
        },
        options: {
          topBar: {
            title: {
              text: t`Choose Side-Scenario`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  };

  canAddScenario() {
    const {
      processedCampaign: {
        scenarios,
        campaignLog,
      },
      campaignGuide,
      campaignState,
    } = this.props;
    const lastCompletedScenarioIndex = findLastIndex(
      scenarios,
      scenario => scenario.type === 'completed'
    );
    if (campaignLog.campaignData.result) {
      return false;
    }
    // Have to have completed a scenario
    if (lastCompletedScenarioIndex === -1) {
      return false;
    }
    if (lastCompletedScenarioIndex + 1 < scenarios.length) {
      const lastScenario = scenarios[lastCompletedScenarioIndex];
      const nextScenario = scenarios[lastCompletedScenarioIndex + 1];
      if (lastScenario.id.scenarioId === nextScenario.id.scenarioId) {
        // Can't insert a scenario in the middle of a replay-loop.
        return false;
      }
    }
    const scenarioInProgress = !!find(
      scenarios,
      scenario => scenario.type === 'started'
    );
    if (scenarioInProgress) {
      return false;
    }
    const completedActualScenario = find(
      scenarios,
      scenario =>
        scenario.type === 'completed' &&
        scenario.scenarioGuide.scenarioType() === 'scenario'
    );
    if (!completedActualScenario) {
      return false;
    }

    const nextScenario = campaignGuide.nextScenario(
      campaignState,
      campaignLog,
      false
    );
    if (nextScenario && nextScenario.scenario.type === 'interlude') {
      // Can't break up an interlude and a scenario.
      return false;
    }
    return true;
  }

  render() {
    const disabled = !this.canAddScenario();
    return (
      <>
        <BasicButton
          title={t`Add side scenario`}
          onPress={this._onPress}
          disabled={disabled}
        />
        { !!disabled && (
          <View style={[space.marginTopM, space.marginBottomL, space.marginSideM]}>
            <Text style={typography.text}>
              { t`Side scenarios cannot be added to a campaign until the previous scenario and following interludes are completed.` }
            </Text>
          </View>
        ) }
      </>
    );
  }
}
