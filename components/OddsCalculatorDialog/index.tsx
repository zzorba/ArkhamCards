import React from 'react';
import { filter, find, forEach, head, map } from 'lodash';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { CardResults, connectRealm } from 'react-native-realm';
import { EventSubscription, Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { Campaign, CampaignDifficulty, CUSTOM, Deck } from '../../actions/types';
import { NavigationProps } from '../types';
import Card from '../../data/Card';
import { AppState } from '../../reducers';
import typography from '../../styles/typography';
import { ChaosBag } from '../../constants';
import { Results } from 'realm';
import { CAMPAIGN_COLORS, campaignScenarios, Scenario, completedScenario } from '../campaign/constants';
import { s } from '../../styles/space';
import PlusMinusButtons from '../core/PlusMinusButtons';
import Difficulty from '../campaign/Difficulty';
import GameHeader from '../campaign/GameHeader';
import BackgroundIcon from '../campaign/BackgroundIcon';
import CardTextComponent from '../CardTextComponent';
import InvestigatorOddsView from './InvestigatorOddsView';
import { add, subtract } from './oddsHelper';

export interface OddsCalculatorProps {
  campaign: Campaign;
  allInvestigators: Card[];
}

interface ReduxProps {
  chaosBag?: ChaosBag;
  deck?: Deck;
  tabooSetId?: number;
  cycleScenarios?: Scenario[];
  scenarioByCode?: { [code: string]: Scenario };
}

interface RealmProps {
  scenarioCards?: Results<Card>;
}

type Props = NavigationProps & OddsCalculatorProps & ReduxProps & RealmProps;

interface State {
  currentScenario?: Scenario;
  currentScenarioCard?: Card;
  difficulty?: string;
  testDifficulty: number;
}

class OddsCalculatorDialog extends React.Component<Props, State> {
  static get options() {
    return {
      topBar: {
        title: {
          text: t`Odds Calculator`,
        },
        backButton: {
          title: t`Back`,
          testID: t`Back`,
        },
      },
    };
  }

  _navEventListener?: EventSubscription;

  constructor(props: Props) {
    super(props);

    const hasCompletedScenario = completedScenario(props.campaign ? props.campaign.scenarioResults : []);
    const currentScenario = head(
      filter(props.cycleScenarios, scenario =>
        !scenario.interlude &&
        !hasCompletedScenario(scenario)
      )
    ) || undefined;

    this.state = {
      currentScenario,
      currentScenarioCard: (props.scenarioCards &&
        currentScenario &&
        find(props.scenarioCards, card => card.encounter_code === currentScenario.code)
      ),
      difficulty: props.campaign ? props.campaign.difficulty : undefined,
      testDifficulty: 0,
    };

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  _showScenarioDialog = () => {
    const {
      currentScenario,
    } = this.state;
    if (!currentScenario) {
      return;
    }
    Navigation.showOverlay({
      component: {
        name: 'Dialog.Scenario',
        passProps: {
          scenarioChanged: this._scenarioChanged,
          scenarios: this.possibleScenarios(),
          selected: currentScenario.name,
        },
        options: {
          layout: {
            backgroundColor: 'rgba(128,128,128,.75)',
          },
        },
      },
    });
  };

  _scenarioChanged = (value: string) => {
    const {
      scenarioCards,
      cycleScenarios,
    } = this.props;
    const scenario = find(cycleScenarios, scenario => scenario.name === value);
    this.setState({
      currentScenario: scenario,
      currentScenarioCard: scenarioCards && scenario && head(scenarioCards.filter(card => card.encounter_code === scenario.code)),
    });
  };

  _increment = () => {
    this.modifyTestDifficulty(add);
  };

  _decrement = () => {
    this.modifyTestDifficulty(subtract);
  };

  possibleScenarios() {
    const {
      cycleScenarios,
    } = this.props;
    return map(
      filter(
        cycleScenarios,
        scenario => !scenario.interlude
      ),
      card => card.name
    );
  }

  modifyTestDifficulty(calculate: Function) {
    const {
      testDifficulty,
    } = this.state;
    this.setState({
      testDifficulty: calculate(testDifficulty, 1),
    });
  }

  renderInvestigatorRows() {
    const {
      allInvestigators,
      chaosBag,
    } = this.props;
    const {
      difficulty,
      currentScenarioCard,
      testDifficulty,
    } = this.state;
    if (!chaosBag || !currentScenarioCard) {
      return;
    }
    return allInvestigators.map((investigator) => {
      return (
        <InvestigatorOddsView
          key={investigator.real_name}
          investigator={investigator}
          difficulty={difficulty}
          testDifficulty={testDifficulty}
          chaosBag={chaosBag}
          currentScenarioCard={currentScenarioCard}
        />
      );

    });
  }

  renderContent() {
    const {
      campaign,
    } = this.props;
    const {
      difficulty,
      testDifficulty,
      currentScenario,
      currentScenarioCard,
    } = this.state;
    const scenarioText = currentScenarioCard && (
      (difficulty === CampaignDifficulty.HARD || difficulty === CampaignDifficulty.EXPERT) ?
        currentScenarioCard.back_text :
        currentScenarioCard.text
    );
    return (
      <>
        <View style={styles.sectionRow}>
          { campaign.cycleCode !== CUSTOM && !!currentScenario && (
            <BackgroundIcon
              code={currentScenario.code}
              color={CAMPAIGN_COLORS[campaign.cycleCode]}
            />
          ) }
          <View>
            <Difficulty difficulty={campaign.difficulty} />
            { !!currentScenario && <GameHeader text={currentScenario.name} /> }
            { !!scenarioText && (
              <CardTextComponent text={scenarioText} />
            ) }
            <Button
              title={t`Change Scenario`}
              onPress={this._showScenarioDialog}
            />
          </View>
        </View>
        <View style={[styles.sectionRow, styles.countRow]}>
          <Text style={typography.text}>{ t`Difficulty` }</Text>
          <Text style={[{ color: 'black', fontSize: 30, marginLeft: 10, marginRight: 10 }]}>
            { testDifficulty }
          </Text>
          <PlusMinusButtons
            count={testDifficulty}
            size={36}
            onIncrement={this._increment}
            onDecrement={this._decrement}
            allowNegative
            color="dark"
          />
        </View>
        { this.renderInvestigatorRows() }
      </>
    );
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        { this.renderContent() }
        <View style={styles.finePrint}>
          <Text style={typography.small}>
            { t`Currently, this does not take into account the Elder Sign effects and tokens that have a value of "-X" and those tokens are considered to have a value of 0. In addition to that, it doesn't yet handle tokens that make you draw additional tokens.` }
          </Text>
        </View>
      </ScrollView>
    );
  }
}

function mapStateToProps(
  state: AppState,
  props: OddsCalculatorProps
): ReduxProps {
  const cycleScenarios = campaignScenarios(props.campaign.cycleCode);
  const scenarioByCode: { [code: string]: Scenario } = {};
  forEach(cycleScenarios, scenario => {
    scenarioByCode[scenario.code] = scenario;
  });
  return {
    chaosBag: props.campaign.chaosBag || {},
    cycleScenarios,
    scenarioByCode,
  };
}

export default connect(mapStateToProps)(
  connectRealm<NavigationProps & OddsCalculatorProps & ReduxProps, RealmProps, Card>(
    OddsCalculatorDialog,
    {
      schemas: ['Card'],
      mapToProps(
        results: CardResults<Card>,
      ): RealmProps {
        return {
          scenarioCards: results.cards.filtered(`(type_code == 'scenario')`),
        };
      },
    })
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  sectionRow: {
    padding: s,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  finePrint: {
    padding: s,
  },
});
