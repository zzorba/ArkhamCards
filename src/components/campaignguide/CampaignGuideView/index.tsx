import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { find, map } from 'lodash';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { campaignScenarios, Scenario } from 'components/campaign/constants';
import LabeledTextBox from 'components/core/LabeledTextBox';
import { NavigationProps } from 'components/nav/types';
import { Campaign, CUSTOM } from 'actions/types';
import CampaignGuide from 'data/scenario/CampaignGuide';
import { getCampaignGuide } from 'data/scenario';
import { getCampaign, AppState } from 'reducers';

import ScenarioComponent from './ScenarioComponent';
import ScenarioStateHelper, { ScenarioState, DEFAULT_SCENARIO_STATE } from './ScenarioStateHelper';

export interface CampaignGuideProps {
  campaignId: number;
}

interface ReduxProps {
  campaign?: Campaign;
}

type Props = CampaignGuideProps & NavigationProps & ReduxProps;

interface State {
  selectedScenario?: Scenario;
  scenarioState: ScenarioState;
}

class CampaignGuideView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedScenario: props.campaign ?
        campaignScenarios(props.campaign.cycleCode)[0] :
        undefined,
      scenarioState: DEFAULT_SCENARIO_STATE,
    };
  }

  componentDidUpdate() {
    const { campaign } = this.props;
    if (!this.state.selectedScenario && campaign) {
      /* eslint-disable react/no-did-update-set-state */
      this.setState({
        selectedScenario: campaign ?
          campaignScenarios(campaign.cycleCode)[0] :
          undefined,
      });
    }
  }

  campaignGuide(campaign: Campaign) {
    return getCampaignGuide(campaign.cycleCode);
  }

  _scenarioChanged = (value: string) => {
    const allScenarios = this.possibleScenarios();
    this.setState({
      selectedScenario: find(
        allScenarios,
        scenario => scenario.name === value
      ),
    });
  };

  _showScenarioDialog = () => {
    const {
      selectedScenario,
    } = this.state;
    Navigation.showOverlay({
      component: {
        name: 'Dialog.Scenario',
        passProps: {
          scenarioChanged: this._scenarioChanged,
          scenarios: map(this.possibleScenarios(), scenario => scenario.name),
          selected: selectedScenario ? selectedScenario.name : CUSTOM,
        },
        options: {
          layout: {
            backgroundColor: 'rgba(128,128,128,.75)',
          },
        },
      },
    });
  };

  possibleScenarios() {
    const {
      campaign,
    } = this.props;
    if (!campaign) {
      return [];
    }
    return campaignScenarios(campaign.cycleCode);
  }

  _updateScenarioState = (scenarioState: ScenarioState) => {
    this.setState({
      scenarioState,
    });
  };

  renderScenario(guide: CampaignGuide) {
    const { selectedScenario } = this.state;
    if (!selectedScenario) {
      return null;
    }
    const scenario = guide.getScenario(selectedScenario.code);
    if (!scenario) {
      return null;
    }
    return (
      <ScenarioComponent
        scenario={scenario}
        guide={guide}
        scenarioState={new ScenarioStateHelper(
          this.state.scenarioState,
          this._updateScenarioState
        )}
      />
    );
  }

  render() {
    const { campaign } = this.props;
    const { selectedScenario } = this.state;
    if (!campaign || campaign.cycleCode === CUSTOM) {
      return null;
    }
    const guide = this.campaignGuide(campaign);
    if (!guide) {
      return null;
    }
    return (
      <ScrollView>
        <View style={styles.margin}>
          { !!selectedScenario && (
            <LabeledTextBox
              label={selectedScenario.interlude ? t`Interlude` : t`Scenario`}
              onPress={this._showScenarioDialog}
              value={selectedScenario.name}
              column
            />
          ) }
        </View>
        { this.renderScenario(guide) }
      </ScrollView>
    );
  }
}


function mapStateToProps(
  state: AppState,
  props: NavigationProps & CampaignGuideProps
): ReduxProps {
  const campaign = getCampaign(state, props.campaignId);
  return {
    campaign,
  };
}

export default connect<ReduxProps, {}, NavigationProps & CampaignGuideProps, AppState>(
  mapStateToProps
)(CampaignGuideView);

const styles = StyleSheet.create({
  margin: {
    margin: 16,
  },
});
