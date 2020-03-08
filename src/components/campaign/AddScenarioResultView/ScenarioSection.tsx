import React from 'react';
import { concat, filter, find, forEach, head, last, map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import Realm from 'realm';
import { connect } from 'react-redux';
import { connectRealm, CardResults } from 'react-native-realm';
import { Navigation } from 'react-native-navigation';

import { t } from 'ttag';
import { Campaign, SingleCampaign, DecksMap, Pack, ScenarioResult, CUSTOM } from 'actions/types';
import Card from 'data/Card';
import { updateCampaign } from '../actions';
import { completedScenario, campaignScenarios, scenarioFromCard, Scenario } from '../constants';
import LabeledTextBox from 'components/core/LabeledTextBox';
import Switch from 'components/core/Switch';
import { ShowTextEditDialog } from 'components/core/withDialogs';
import { getAllDecks, getAllCyclePacks, getAllStandalonePacks, getPack, getTabooSet, AppState } from 'reducers';
import typography from 'styles/typography';


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

interface RealmProps {
  allScenarios: Scenario[];
}

type Props = OwnProps & ReduxProps & ReduxActionProps & RealmProps;

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

export default connect(mapStateToPropsFix, mapDispatchToProps)(
  connectRealm<OwnProps & ReduxProps & ReduxActionProps, RealmProps, Card>(
    ScenarioSection, {
      schemas: ['Card'],
      mapToProps(
        results: CardResults<Card>,
        realm: Realm,
        props: OwnProps & ReduxProps & ReduxActionProps
      ): RealmProps {
        const hasCompletedScenario = completedScenario(props.campaign.scenarioResults);
        const finishedScenarios = new Set(props.campaign.finishedScenarios);
        const cyclePackCodes = new Set(map(props.cyclePacks, pack => pack.code));
        const standalonePackCodes = new Set(map(props.standalonePacks, pack => pack.code));

        const allScenarioCards = results.cards
          .filtered(`(type_code == "scenario") and ${Card.tabooSetQuery(props.tabooSetId)}`)
          .sorted('position');

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
      },
    }),
);

const styles = StyleSheet.create({
  margin: {
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
