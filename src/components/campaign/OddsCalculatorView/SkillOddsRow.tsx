import React from 'react';
import { clone, find, filter, map } from 'lodash';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { t } from 'ttag';

import typography from 'styles/typography';
import { ChaosBag, ChaosTokenType, SKILL_COLORS, SKILL_COLORS_LIGHT, SkillCodeType, SpecialTokenValue, isSpecialToken, ChaosTokenValue } from 'constants';
import { flattenChaosBag } from 'components/campaign/campaignUtil';
import ArkhamIcon from 'icons/ArkhamIcon';
import PlusMinusButtons from 'components/core/PlusMinusButtons';
import { COLORS } from 'styles/colors';
import { add, binomdist, formatPercentageText, subtract } from './oddsHelper';
import { s } from 'styles/space';

export interface SkillOddsRowProps {
  chaosBag: ChaosBag;
  stat: number;
  specialTokenValues: SpecialTokenValue[];
  type: SkillCodeType;
  testDifficulty: number;
}

type Props = SkillOddsRowProps;

interface State {
  boosts: {
    [skill in SkillCodeType]: number;
  };
  collapsed: boolean;
}

export default class SkillOddsRow extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      boosts: {
        willpower: 0,
        intellect: 0,
        combat: 0,
        agility: 0,
        wild: 0,
      },
      collapsed: true,
    };
  }

  _decrement = () => {
    this.modifyBoostValue(subtract);
  };

  _increment = () => {
    this.modifyBoostValue(add);
  };

  _toggleAdditionalRows = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  totalTokens(keepRevealAnother?: boolean) {
    return filter(
      this.modifiedChaosBag(),
      value => value !== 'reveal_another' || !!keepRevealAnother
    ).length;
  }

  modifiedChaosBag(): ChaosTokenValue[] {
    const {
      chaosBag,
      specialTokenValues,
    } = this.props;
    const flatChaosBag = flattenChaosBag(chaosBag);
    return map(flatChaosBag, (token: ChaosTokenType) => {
      if (isSpecialToken(token)) {
        const specialToken = find(specialTokenValues, t => t.token === token);
        if (specialToken) {
          return specialToken.value;
        }
      }
      return parseFloat(token);
    });
  }

  static countSuccessfulTokens(
    testDifficulty: number,
    committed: number,
    chaosBag: ChaosTokenValue[],
    successBreakpoint = 0
  ) {
    const effectiveDifficulty = (testDifficulty + successBreakpoint);
    const successTokens = filter(chaosBag, (value: ChaosTokenValue) => {
      switch (value) {
        case 'auto_fail': {
          if (effectiveDifficulty === 0) {
            return false;
          }
          return (testDifficulty + successBreakpoint) <= 0;
        }
        case 'auto_succeed':
          // Auto succeed means succeed by 0.
          return successBreakpoint === 0;
        case 'reveal_another':
          // Skip this token, it will be skipped on denominator as well.
          return false;
        case 'X':
          return false;
        default: {
          const modifiedValue = Math.max(committed + value, 0);
          return modifiedValue >= effectiveDifficulty;
        }
      }
    });
    return successTokens.length;
  }

  calculate(
    baseStat: number,
    skill: SkillCodeType,
    successBreakpoint = 0,
    calculateFailure = false
  ) {
    const {
      testDifficulty,
    } = this.props;
    const {
      boosts,
    } = this.state;
    const totalTokens = this.totalTokens();
    baseStat = baseStat || 0;
    const assets = 0;
    const boost = boosts[skill];
    const committed = baseStat + assets + boost;
    const chaosBag = this.modifiedChaosBag();
    const successTokens = SkillOddsRow.countSuccessfulTokens(
      testDifficulty,
      committed,
      chaosBag,
      0
    );
    let successNumber = SkillOddsRow.countSuccessfulTokens(
      testDifficulty,
      committed,
      chaosBag,
      successBreakpoint
    );
    if (calculateFailure) {
      successNumber = successNumber - successTokens;
    }
    if (successNumber && totalTokens > 0) {
      return (successNumber / totalTokens) || 0;
    }
    return 0;
  }

  modifyBoostValue(calculate: Function) {
    const {
      boosts,
    } = this.state;
    const {
      type,
    } = this.props;
    let newBoosts = clone(boosts);
    newBoosts[type] = calculate(boosts[type], 1);
    newBoosts = { ...boosts, ...newBoosts };
    this.setState({
      boosts: newBoosts,
    });
  }

  getAutoSuccessPercentage() {
    const totalTokens = this.totalTokens(true);
    if (totalTokens > 0) {
      return (totalTokens - 1) / totalTokens;
    }
    return 1;
  }

  calculateDrawTwoPickOne(
    baseStat: number,
    skill: SkillCodeType
  ) {
    const { testDifficulty } = this.props;
    const { boosts } = this.state;
    const totalTokens = this.totalTokens();

    const boost = boosts[skill];
    const committed = baseStat + boost;
    const successTokens = SkillOddsRow.countSuccessfulTokens(
      testDifficulty,
      committed,
      this.modifiedChaosBag()
    );
    const failureTokens = totalTokens - successTokens;
    if (totalTokens < 2) {
      // If there are less than 2 tokens, its either 100% or 0%.
      return successTokens;
    }
    return (
      successTokens > 0 ? (
        (successTokens / totalTokens) * ((successTokens - 1) / (totalTokens - 1))
      ) : 0
    ) + (
      failureTokens > 1 ? (
        2 * (successTokens / totalTokens) * (failureTokens / (totalTokens - 1))
      ) : 0
    );
  }

  renderAdditionalRow(
    title: string,
    value: number,
    light?: boolean
  ) {
    const {
      type,
    } = this.props;
    const backgroundColor = light ? SKILL_COLORS_LIGHT[type] : SKILL_COLORS[type];
    return (
      <View key={title} style={[styles.additionalRow, { backgroundColor }]}>
        <Text style={styles.additionalRowText}>{ title }</Text>
        <Text style={styles.additionalRowText}>{ formatPercentageText(value) }</Text>
      </View>
    );
  }

  render() {
    const {
      stat,
      type,
      testDifficulty,
    } = this.props;
    const {
      boosts,
      collapsed,
    } = this.state;
    const success = this.calculate(stat, type);
    const successTwice = binomdist(2, 2, success);
    const reRollOnFail = binomdist(2, 1, success) + binomdist(2, 2, success);
    const failTwoOrMore = this.calculate(stat, type, -2, true);
    const failOneOrMore = this.calculate(stat, type, -1, true);
    const succeedOneOrMore = this.calculate(stat, type, 1);
    const succeedTwoOrMore = this.calculate(stat, type, 2);
    const succeedThreeOrMore = this.calculate(stat, type, 3);
    const drawTwoPickOne = this.calculateDrawTwoPickOne(stat, type);
    const rows = [];
    rows.push({
      title: t`Success`,
      value: success,
    });
    rows.push({
      title: t`Draw Two, Pick One`,
      value: drawTwoPickOne,
    });
    rows.push({
      title: t`Fail By 2 or Less`,
      value: testDifficulty <= 2 ? (1 - success) : failTwoOrMore,
    });
    rows.push({
      title: t`Fail By 1 or Less`,
      value: testDifficulty <= 1 ? (1 - success) : failOneOrMore,
    });
    rows.push({ title: t`Succeed By 1 or More`, value: succeedOneOrMore });
    rows.push({ title: t`Succeed By 2 or More`, value: succeedTwoOrMore });
    rows.push({ title: t`Succeed By 3 or More`, value: succeedThreeOrMore });
    rows.push({ title: t`Re-Draw After Fail`, value: reRollOnFail });
    rows.push({ title: t`Succeed Twice In A Row`, value: successTwice });
    return (
      <React.Fragment>
        <TouchableOpacity style={styles.skillRow}
          onPress={this._toggleAdditionalRows}
        >
          <View style={styles.row}>
            <View style={[styles.skillBox, { backgroundColor: SKILL_COLORS[type] }]}>
              <Text style={styles.skillValue}>
                { type !== 'wild' ? `${stat}` : '' }<ArkhamIcon name={type} size={28} color={COLORS.white} />
              </Text>
            </View>
            <Text style={typography.text}>{ formatPercentageText(success) }</Text>
          </View>
          <View style={[styles.row, { paddingRight: s }]}>
            <Text style={[typography.text, { color: 'black', fontSize: 22, paddingRight: s }]}>
              { boosts[type] >= 0 ? `+${boosts[type]}` : boosts[type] }
            </Text>
            <PlusMinusButtons
              count={boosts[type]}
              size={36}
              onIncrement={this._increment}
              onDecrement={this._decrement}
              allowNegative
              color="dark"
            />
          </View>
        </TouchableOpacity>
        <Collapsible collapsed={collapsed}>
          { rows.map((row, index) => {
            const evenRow = (index % 2) === 0;
            return this.renderAdditionalRow(row.title, row.value, evenRow);
          }) }
        </Collapsible>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  skillBox: {
    height: 50,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  skillValue: {
    ...typography.bigGameFont,
    color: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  additionalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  additionalRowText: {
    ...typography.text,
    color: COLORS.white,
  },
  skillRow: {
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
});
