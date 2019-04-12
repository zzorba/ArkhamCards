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
import { Campaign, SingleCampaign, DecksMap, Pack, ScenarioResult, CUSTOM } from '../../../actions/types';
import Card from '../../../data/Card';
import { updateCampaign } from '../actions';
import { campaignScenarios, Scenario } from '../constants';
import LabeledTextBox from '../../core/LabeledTextBox';
import Switch from '../../core/Switch';
import { ShowTextEditDialog } from '../../core/withDialogs';
import { getAllDecks, getAllPacks, getPack, AppState } from '../../../reducers';
import typography from '../../../styles/typography';


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
}

interface ReduxActionProps {
  updateCampaign: (id: number, sparseCampaign: Campaign) => void;
}

interface RealmProps {
  allScenarios: Scenario[];
}

type Props = OwnProps & ReduxProps & ReduxActionProps &  RealmProps;

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
    updateCampaign(campaign.id, { showInterludes: !showInterludes } as Campaign);
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

function mapStateToProps(state: AppState, props: OwnProps): ReduxProps {
  const latestScenario = last(props.campaign.scenarioResults || []);
  const cyclePack = getPack(state, props.campaign.cycleCode);
  const allPacks = getAllPacks(state);
  const cyclePacks = !cyclePack ? [] : filter(allPacks, pack => pack.cycle_position === cyclePack.cycle_position);
  const standalonePacks = filter(allPacks, pack => pack.cycle_position === 70);
  return {
    showInterludes: !!props.campaign.showInterludes,
    cycleScenarios: campaignScenarios(props.campaign.cycleCode),
    cyclePacks,
    standalonePacks,
    decks: getAllDecks(state),
    latestScenario,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    updateCampaign,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectRealm<OwnProps & ReduxProps & ReduxActionProps, RealmProps, Card>(
    ScenarioSection, {
      schemas: ['Card'],
      mapToProps(
        results: CardResults<Card>,
        realm: Realm,
        props: OwnProps & ReduxProps & ReduxActionProps
      ): RealmProps {
        const finishedScenarios = new Set(props.campaign.finishedScenarios);
        const cyclePackCodes = new Set(map(props.cyclePacks, pack => pack.code));
        const standalonePackCodes = new Set(map(props.standalonePacks, pack => pack.code));

        const allScenarioCards = results.cards
          .filtered('type_code == "scenario"')
          .sorted('position');

        const cycleScenarios: Card[] = [];
        const standaloneScenarios: Card[] = [];
        forEach(allScenarioCards, card => {
          if (cyclePackCodes.has(card.pack_code)) {
            cycleScenarios.push(card);
          }
          if (standalonePackCodes.has(card.pack_code) && !finishedScenarios.has(card.name)) {
            standaloneScenarios.push(card);
          }
        });
        return {
          allScenarios: concat(
            filter(
              props.cycleScenarios || cycleScenarios,
              scenario => !finishedScenarios.has(scenario.name)),
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
