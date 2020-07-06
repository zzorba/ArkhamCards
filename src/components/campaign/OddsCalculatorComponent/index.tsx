import React from 'react';
import { filter, find, flatMap, forEach, head, map } from 'lodash';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';
import LinearGradient from 'react-native-linear-gradient';
import KeepAwake from 'react-native-keep-awake';

import BasicButton from 'components/core/BasicButton';
import InvestigatorOddsComponent from './InvestigatorOddsComponent';
import SkillOddsRow from './SkillOddsRow';
import VariableTokenInput from './VariableTokenInput';
import { add, subtract } from './oddsHelper';
import CardTextComponent from 'components/card/CardTextComponent';
import ChaosBagLine from 'components/core/ChaosBagLine';
import PlusMinusButtons from 'components/core/PlusMinusButtons';
import { CAMPAIGN_COLORS, Scenario, completedScenario } from 'components/campaign/constants';
import Difficulty from 'components/campaign/Difficulty';
import GameHeader from 'components/campaign/GameHeader';
import BackgroundIcon from 'components/campaign/BackgroundIcon';
import { Campaign, CampaignDifficulty, CUSTOM } from 'actions/types';
import { ChaosBag, CHAOS_TOKEN_COLORS, SPECIAL_TOKENS, SpecialTokenValue } from 'app_constants';
import Card from 'data/Card';
import typography from 'styles/typography';
import { s } from 'styles/space';
import COLORS from 'styles/colors';

interface Props {
  campaign: Campaign;
  chaosBag: ChaosBag;
  fontScale: number;
  cycleScenarios?: Scenario[];
  scenarioByCode?: { [code: string]: Scenario };
  allInvestigators: Card[];
  scenarioCards?: Card[];
}

interface State {
  currentScenario?: Scenario;
  currentScenarioCard?: Card;
  difficulty?: string;
  testDifficulty: number;
  specialTokenValues: SpecialTokenValue[];
  xValue: { [token: string]: number };
}

export default class OddsCalculatorComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const hasCompletedScenario = completedScenario(props.campaign ? props.campaign.scenarioResults : []);
    const currentScenario = head(
      filter(props.cycleScenarios, scenario =>
        !scenario.interlude &&
        !hasCompletedScenario(scenario)
      )
    ) || undefined;

    const {
      currentScenarioCard,
      difficulty,
    } = this.currentScenarioState(currentScenario);

    this.state = {
      currentScenario,
      currentScenarioCard,
      difficulty,
      testDifficulty: 0,
      specialTokenValues: OddsCalculatorComponent.parseSpecialTokenValues(currentScenarioCard, difficulty),
      xValue: {
        skull: 0,
        cultist: 0,
        tablet: 0,
        elder_thing: 0,
      },
    };
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
      },
    });
  };

  currentScenarioState(currentScenario?: Scenario) {
    const {
      scenarioCards,
      campaign,
    } = this.props;
    const difficulty = campaign ? campaign.difficulty : undefined;
    const encounterCode = currentScenario && (
      currentScenario.code.startsWith('return_to_') ?
        currentScenario.code.substring('return_to_'.length) :
        currentScenario.code);
    const currentScenarioCard = (scenarioCards && encounterCode) ?
      find(scenarioCards, card => card.encounter_code === encounterCode) :
      undefined;
    const specialTokenValues = OddsCalculatorComponent.parseSpecialTokenValues(
      currentScenarioCard,
      difficulty
    );
    return {
      currentScenario,
      currentScenarioCard,
      specialTokenValues,
      difficulty,
    };
  }

  _scenarioChanged = (value: string) => {
    const {
      cycleScenarios,
    } = this.props;
    const currentScenario = find(cycleScenarios, scenario => scenario.name === value);
    this.setState(this.currentScenarioState(currentScenario));
  };

  static parseSpecialTokenValues(
    currentScenarioCard?: Card,
    difficulty?: string
  ): SpecialTokenValue[] {
    const scenarioTokens: SpecialTokenValue[] = [];
    if (currentScenarioCard) {
      let scenarioText = currentScenarioCard.text;
      if (difficulty === CampaignDifficulty.HARD ||
        difficulty === CampaignDifficulty.EXPERT) {
        scenarioText = currentScenarioCard.back_text;
      }
      if (scenarioText) {
        const linesByToken: { [token: string]: string } = {};
        forEach(
          scenarioText.split('\n'),
          line => {
            const token = find(SPECIAL_TOKENS, token =>
              line.startsWith(`[${token}]`));
            if (token) {
              linesByToken[token] = line;
            }
          });
        SPECIAL_TOKENS.forEach(token => {
          switch (token) {
            case 'elder_sign':
              scenarioTokens.push({
                token,
                value: 0,
              });
              break;
            case 'auto_fail':
              scenarioTokens.push({
                token,
                value: 'auto_fail',
              });
              break;
            default: {
              const line = linesByToken[token];
              if (line) {
                const valueRegex = new RegExp(`\\[(${token})\\]\\s*:?\\s([-+][0-9X])(\\. )?(.*)`);
                if (valueRegex.test(line)) {
                  const match = line.match(valueRegex);
                  if (match) {
                    if (match[2] === '-X') {
                      scenarioTokens.push({
                        token,
                        value: 'X',
                        xText: match[4],
                      });
                    } else {
                      scenarioTokens.push({
                        token,
                        value: parseFloat(match[2]) || 0,
                      });
                    }
                  }
                } else {
                  const revealAnotherRegex = new RegExp(`\\[(${token})\\]\\s*:?\\sReveal another (chaos )?token.`);
                  if (revealAnotherRegex.test(line)) {
                    scenarioTokens.push({
                      token,
                      value: 'reveal_another',
                    });
                  }
                }
              }
            }
          }
        });
      }
    }
    return scenarioTokens;
  }

  _incrementToken = (token: string) => {
    const { xValue } = this.state;
    this.setState({
      xValue: {
        ...xValue,
        [token]: xValue[token] + 1,
      },
    });
  };

  _decrementToken= (token: string) => {
    const { xValue } = this.state;
    this.setState({
      xValue: {
        ...xValue,
        [token]: xValue[token] - 1,
      },
    });
  };

  _incrementDifficulty = () => {
    this.modifyTestDifficulty(add);
  };

  _decrementDifficulty = () => {
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

  getSpecialTokenValues() {
    const {
      specialTokenValues,
      xValue,
    } = this.state;
    return map(specialTokenValues, tokenValue => {
      if (tokenValue.value === 'X') {
        return {
          token: tokenValue.token,
          value: -xValue[tokenValue.token],
        };
      }
      return tokenValue;
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
    const specialTokenValues = this.getSpecialTokenValues();
    return (
      <>
        <SkillOddsRow
          chaosBag={chaosBag}
          stat={0}
          specialTokenValues={specialTokenValues}
          type="wild"
          testDifficulty={testDifficulty}
        />
        { map(allInvestigators, investigator => (
          <InvestigatorOddsComponent
            key={investigator.real_name}
            investigator={investigator}
            difficulty={difficulty}
            testDifficulty={testDifficulty}
            chaosBag={chaosBag}
            specialTokenValues={specialTokenValues}
          />))
        }
      </>
    );
  }

  renderSpecialTokenInputs() {
    const { specialTokenValues, xValue } = this.state;
    if (!find(specialTokenValues, value => value.value === 'X')) {
      return null;
    }
    return (
      <>
        { flatMap(specialTokenValues, token => {
          if (token.value !== 'X' || !token.xText) {
            return null;
          }
          return (
            <VariableTokenInput
              key={token.token}
              symbol={token.token}
              color={CHAOS_TOKEN_COLORS[token.token]}
              value={xValue[token.token]}
              text={token.xText}
              increment={this._incrementToken}
              decrement={this._decrementToken}
            />
          );
        }) }
      </>
    );
  }

  renderContent(campaign: Campaign) {
    const {
      fontScale,
      chaosBag,
    } = this.props;
    const {
      difficulty,
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
          <View style={styles.button}>
            { !!campaign.difficulty && <Difficulty difficulty={campaign.difficulty} /> }
            { !!currentScenario && <GameHeader text={currentScenario.name} /> }
            { !!scenarioText && (
              <CardTextComponent text={scenarioText} />
            ) }
          </View>
          <BasicButton
            title={t`Change Scenario`}
            onPress={this._showScenarioDialog}
          />
        </View>
        { this.renderSpecialTokenInputs() }
        <View style={styles.sectionRow}>
          <Text style={typography.label}>{ t`Chaos Bag` }</Text>
          <ChaosBagLine
            chaosBag={chaosBag}
            fontScale={fontScale}
          />
        </View>
        { this.renderInvestigatorRows() }
      </>
    );
  }

  render() {
    const { campaign } = this.props;
    const {
      testDifficulty,
    } = this.state;
    return (
      <View style={styles.container}>
        <KeepAwake />
        <ScrollView style={styles.container}>
          { this.renderContent(campaign) }
          <View style={styles.finePrint}>
            <Text style={typography.small}>
              { t`Note: chaos tokens that cause additional tokens to be revealed does not show correct odds for the "Draw Two Pick One" and similar multi-draw situations.` }
            </Text>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <LinearGradient
            colors={['#ededed', '#f0f0f0']}
            style={[styles.countRow, styles.footerRow]}
          >
            <Text style={typography.text}>{ t`Difficulty` }</Text>
            <Text style={[{ color: 'black', fontSize: 30, marginLeft: 10, marginRight: 10 }]}>
              { testDifficulty }
            </Text>
            <PlusMinusButtons
              count={testDifficulty}
              size={36}
              onIncrement={this._incrementDifficulty}
              onDecrement={this._decrementDifficulty}
              color="dark"
            />
          </LinearGradient>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.background,
  },
  sectionRow: {
    padding: s,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#444',
  },
  footerRow: {
    padding: s,
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  finePrint: {
    padding: s,
  },
  button: {
    padding: s,
  },
});
