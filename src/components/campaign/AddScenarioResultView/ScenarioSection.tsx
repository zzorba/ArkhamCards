import React from 'react';
import { concat, filter, find, forEach, head, last, map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { Campaign, SingleCampaign, DecksMap, Pack, ScenarioResult, CUSTOM } from '@actions/types';
import connectDb from '@components/data/connectDb';
import { updateCampaign } from '../actions';
import { completedScenario, campaignScenarios, scenarioFromCard, Scenario } from '../constants';
import LabeledTextBox from '@components/core/LabeledTextBox';
import Switch from '@components/core/Switch';
import { ShowTextEditDialog } from '@components/core/withDialogs';
import Database from '@data/Database';
import { getAllDecks, getAllCyclePacks, getAllStandalonePacks, getPack, getTabooSet, AppState } from '@reducers';
import typography from '@styles/typography';
import { s } from '@styles/space';

interface OwnProps {
  componentId: string;
  campaign: SingleCampaign;
  scenarioChanged: (result: ScenarioResult) => void;
  showTextEditDialog: ShowTextEditDialog;
}

interface ReduxProps {
  showInterludes: boolean;
  cycleScenarios: Scenario[];
  cyclePacks: Pack[];
  standalonePacks: Pack[];
  decks: DecksMap;
  latestScenario?: ScenarioResult;
  tabooSetId?: number;
}

interface ReduxActionProps {
  updateCampaign: (id: number, sparseCampaign: Partial<Campaign>) => void;
}

interface Data {
  allScenarios: Scenario[];
}

type Props = OwnProps & ReduxProps & ReduxActionProps & Data;

interface State {
  selectedScenario: typeof CUSTOM | Scenario;
  customScenario: string;
  resolution: string;
}

class ScenarioSection extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const nextScenario = head(props.allScenarios);
    this.state = {
      selectedScenario: nextScenario || CUSTOM,
      customScenario: '',
      resolution: '',
    };
  }

  componentDidMount() {
    this._updateManagedScenario();
  }

  _toggleShowInterludes = () => {
    const {
      campaign,
      showInterludes,
      updateCampaign,
    } = this.props;
    const campaignUpdate: Campaign = { showInterludes: !showInterludes } as any;
    updateCampaign(campaign.id, campaignUpdate);
  };

  _showCustomCampaignDialog = () => {
    const {
      showTextEditDialog,
    } = this.props;
    showTextEditDialog(
      t`Custom Scenario Name`,
      this.state.customScenario,
      this._customScenarioTextChanged
    );
  };

  _showResolutionDialog = () => {
    const {
      showTextEditDialog,
    } = this.props;
    showTextEditDialog(
      'Resolution',
      this.state.resolution,
      this._resolutionChanged
    );
  };

  _updateManagedScenario = () => {
    const {
      selectedScenario,
      customScenario,
      resolution,
    } = this.state;

    this.props.scenarioChanged({
      scenario: selectedScenario !== CUSTOM ? selectedScenario.name : customScenario,
      scenarioCode: selectedScenario !== CUSTOM ? selectedScenario.code : CUSTOM,
      scenarioPack: selectedScenario !== CUSTOM ? selectedScenario.pack_code : CUSTOM,
      interlude: selectedScenario !== CUSTOM && !!selectedScenario.interlude,
      resolution: resolution,
    });
  };

  _scenarioChanged = (value: string) => {
    const {
      allScenarios,
    } = this.props;
    this.setState({
      selectedScenario: find(
        allScenarios,
        scenario => scenario.name === value
      ) || CUSTOM,
    }, this._updateManagedScenario);
  };

  _customScenarioTextChanged = (value: string) => {
    this.setState({
      customScenario: value,
    }, this._updateManagedScenario);
  };

  _resolutionChanged = (value: string) => {
    this.setState({
      resolution: value,
    }, this._updateManagedScenario);
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
          scenarios: this.possibleScenarios(),
          selected: selectedScenario === CUSTOM ? CUSTOM : selectedScenario.name,
        },
      },
    });
  };

  possibleScenarios() {
    const {
      allScenarios,
      showInterludes,
    } = this.props;
    const scenarios = map(
      filter(allScenarios, scenario => showInterludes || !scenario.interlude),
      card => card.name);
    scenarios.push(CUSTOM);
    return scenarios;
  }

  render() {
    const {
      selectedScenario,
      customScenario,
      resolution,
    } = this.state;

    return (
      <View>
        <View style={[styles.margin, styles.row]}>
          <Text style={typography.text}>
            { t`Show Interludes` }
          </Text>
          <Switch
            value={this.props.showInterludes}
            onValueChange={this._toggleShowInterludes}
          />
        </View>
        <LabeledTextBox
          label={selectedScenario !== CUSTOM && selectedScenario.interlude ? t`Interlude` : t`Scenario`}
          onPress={this._showScenarioDialog}
          value={selectedScenario === CUSTOM ? CUSTOM : selectedScenario.name}
          style={styles.margin}
          column
        />
        { selectedScenario === CUSTOM && (
          <LabeledTextBox
            label={t`Name`}
            onPress={this._showCustomCampaignDialog}
            value={customScenario}
            style={styles.margin}
            column
          />
        ) }
        { (selectedScenario === CUSTOM || !selectedScenario.interlude) && (
          <LabeledTextBox
            label={t`Resolution`}
            placeholder={t`(required)`}
            onPress={this._showResolutionDialog}
            value={resolution}
            style={styles.margin}
            column
          />
        ) }
      </View>
    );
  }
}

function mapStateToPropsFix(state: AppState, props: OwnProps): ReduxProps {
  const latestScenario = last(props.campaign.scenarioResults || []);
  const cyclePack = getPack(state, props.campaign.cycleCode);
  const cyclePacks = getAllCyclePacks(state, cyclePack);
  const standalonePacks = getAllStandalonePacks(state);
  return {
    showInterludes: !!props.campaign.showInterludes,
    cycleScenarios: campaignScenarios(props.campaign.cycleCode),
    cyclePacks,
    standalonePacks,
    decks: getAllDecks(state),
    latestScenario,
    tabooSetId: getTabooSet(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    updateCampaign,
  }, dispatch);
}

interface DbProps {
  scenarioResults: ScenarioResult[];
  finishedScenarios: string[];
  cyclePacks: Pack[];
  standalonePacks: Pack[];
  cycleScenarios: Scenario[];
}

export default connect(mapStateToPropsFix, mapDispatchToProps)(
  connectDb<OwnProps & ReduxProps & ReduxActionProps, Data, DbProps>(
    ScenarioSection,
    (props: OwnProps & ReduxProps & ReduxActionProps) => {
      return {
        scenarioResults: props.campaign.scenarioResults,
        finishedScenarios: props.campaign.finishedScenarios,
        cyclePacks: props.cyclePacks,
        standalonePacks: props.standalonePacks,
        cycleScenarios: props.cycleScenarios,
      };
    },
    async(db: Database, props) => {
      const hasCompletedScenario = completedScenario(props.scenarioResults);
      const finishedScenarios = new Set(props.finishedScenarios);
      const cyclePackCodes = new Set(map(props.cyclePacks, pack => pack.code));
      const standalonePackCodes = new Set(map(props.standalonePacks, pack => pack.code));
      const allScenarioCards = await (await db.cardsQuery())
        .where('c.type_code = "scenario"')
        .orderBy('c.position', 'ASC')
        .getMany();

      const cycleScenarios: Scenario[] = [];
      const standaloneScenarios: Scenario[] = [];
      forEach(allScenarioCards, card => {
        if (cyclePackCodes.has(card.pack_code)) {
          const scenario = scenarioFromCard(card);
          if (scenario) {
            cycleScenarios.push(scenario);
          }
        }
        if (standalonePackCodes.has(card.pack_code) && !finishedScenarios.has(card.name)) {
          const scenario = scenarioFromCard(card);
          if (scenario) {
            standaloneScenarios.push(scenario);
          }
        }
      });
      return {
        allScenarios: concat(
          filter(
            props.cycleScenarios || cycleScenarios,
            scenario => !finishedScenarios.has(scenario.name) && !hasCompletedScenario(scenario)),
          standaloneScenarios
        ),
      };
    }
  )
);

const styles = StyleSheet.create({
  margin: {
    marginLeft: s,
    marginRight: s,
    marginBottom: s,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
