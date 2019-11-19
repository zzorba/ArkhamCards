import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Card from '../../data/Card';
import typography from '../../styles/typography';
import { ChaosBag, ChaosTokenType, SPECIAL_TOKENS } from '../../constants';
import { COLORS } from '../../styles/colors';
import SkillOddsRow from './SkillOddsRow';
import { CampaignDifficulty } from '../../actions/types';

export interface InvestigatorOddsProps {
  chaosBag: ChaosBag;
  currentScenarioCard: Card;
  difficulty?: string;
  investigator: Card;
  testDifficulty: number;
}

type Props = InvestigatorOddsProps;

interface State {
  specialTokenValues: { token: ChaosTokenType; value: number; raw_value: string | null }[];
}

export default class InvestigatorOddsView extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      specialTokenValues: [],
    };
  }

  componentDidMount(): void {
    this.getSpecialTokenValues();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.currentScenarioCard !== prevProps.currentScenarioCard) {
      this.getSpecialTokenValues();
    }
  }

  getSpecialTokenValues() {
    const {
      currentScenarioCard,
      difficulty,
    } = this.props;
    const scenarioTokens:
      { token: ChaosTokenType;
        value: number;
        raw_value: string | null;
      }[] = [];
    if (currentScenarioCard) {
      SPECIAL_TOKENS.forEach(token => {
        const valueRegex = new RegExp(`\\[(${token})\\]:?\\s([-+][0-9X])`);
        if (token === 'elder_sign') {
          scenarioTokens.push({
            token,
            value: 0,
            raw_value: '0',
          });
        }
        if (token === 'auto_fail') {
          scenarioTokens.push({
            token,
            value: -666,
            raw_value: '-666',
          });
        }
        let scenarioText = currentScenarioCard.real_text;
        if (difficulty === CampaignDifficulty.HARD || difficulty === CampaignDifficulty.EXPERT) {
          scenarioText = currentScenarioCard.back_text;
        }
        if (scenarioText) {
          if (valueRegex.test(scenarioText)) {
            const match = scenarioText.match(valueRegex);
            if (match) {
              scenarioTokens.push({
                token,
                value: parseFloat(match[2]) || 0,
                raw_value: match[2],
              });
            }
          }
        }
      });
    }
    this.setState({
      specialTokenValues: scenarioTokens,
    });
  }

  render() {
    const {
      investigator,
      testDifficulty,
      chaosBag,
    } = this.props;
    const {
      specialTokenValues,
    } = this.state;

    const willpower = investigator.skill_willpower || 0;
    const intellect = investigator.skill_intellect || 0;
    const combat = investigator.skill_combat || 0;
    const agility = investigator.skill_agility || 0;

    return (
      <React.Fragment>
        <View style={[styles.headerRow]}>
          <Text style={typography.text}>{ investigator.name }</Text>
        </View>
        <SkillOddsRow stat={willpower} type={'willpower'} testDifficulty={testDifficulty} chaosBag={chaosBag} specialTokenValues={specialTokenValues} />
        <SkillOddsRow stat={intellect} type={'intellect'} testDifficulty={testDifficulty} chaosBag={chaosBag} specialTokenValues={specialTokenValues} />
        <SkillOddsRow stat={combat} type={'combat'} testDifficulty={testDifficulty} chaosBag={chaosBag} specialTokenValues={specialTokenValues} />
        <SkillOddsRow stat={agility} type={'agility'} testDifficulty={testDifficulty} chaosBag={chaosBag} specialTokenValues={specialTokenValues} />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  headerRow: {
    backgroundColor: COLORS.lightGray,
    paddingTop: 5,
    paddingRight: 15,
    paddingBottom: 5,
    paddingLeft: 5,
  },
});
