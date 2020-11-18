import React, { useCallback, useContext, useMemo } from 'react';
import { find, filter, map } from 'lodash';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { t } from 'ttag';

import { ChaosBag, ChaosTokenType, SkillCodeType, SpecialTokenValue, isSpecialToken, ChaosTokenValue } from '@app_constants';
import { flattenChaosBag } from '@components/campaign/campaignUtil';
import ArkhamIcon from '@icons/ArkhamIcon';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import COLORS from '@styles/colors';
import { binomdist, formatPercentageText } from './oddsHelper';
import { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useCounter, useFlag } from '@components/core/hooks';

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

function countSuccessfulTokens(testDifficulty: number, committed: number, chaosBag: ChaosTokenValue[], successBreakpoint = 0) {
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

export default function SkillOddsRow({ chaosBag, stat, specialTokenValues, type, testDifficulty }: SkillOddsRowProps) {
  const { borderStyle, typography } = useContext(StyleContext);
  const [boost, incBoost, decBoost] = useCounter(0, {});
  const [collapsed, toggleAdditionalRows] = useFlag(true);

  const modifiedChaosBag: ChaosTokenValue[] = useMemo(() => {
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
  }, [chaosBag, specialTokenValues]);

  const totalTokens = useMemo((keepRevealAnother?: boolean) => {
    return filter(
      modifiedChaosBag,
      value => value !== 'reveal_another' || !!keepRevealAnother
    ).length;
  }, [modifiedChaosBag]);

  const calculate = useCallback((successBreakpoint = 0, calculateFailure = false) => {
    const assets = 0;
    const committed = stat + assets + boost;
    const successTokens = countSuccessfulTokens(
      testDifficulty,
      committed,
      modifiedChaosBag,
      0
    );
    let successNumber = countSuccessfulTokens(
      testDifficulty,
      committed,
      modifiedChaosBag,
      successBreakpoint
    );
    if (calculateFailure) {
      successNumber = successNumber - successTokens;
    }
    if (successNumber && totalTokens > 0) {
      return (successNumber / totalTokens) || 0;
    }
    return 0;
  }, [testDifficulty, stat, boost, modifiedChaosBag, totalTokens]);

  const drawTwoPickOne = useMemo(() => {
    const committed = stat + boost;
    const successTokens = countSuccessfulTokens(
      testDifficulty,
      committed,
      modifiedChaosBag
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
  }, [testDifficulty, stat, boost, totalTokens, modifiedChaosBag]);
  const color = COLORS.skill[type];
  const renderAdditionalRow = useCallback((title: string, value: number, light?: boolean) => {
    const backgroundColor = light ? color.light : color.default;
    return (
      <View key={title} style={[styles.additionalRow, borderStyle, { backgroundColor }]}>
        <Text style={[typography.text, styles.additionalRowText]}>{ title }</Text>
        <Text style={[typography.text, styles.additionalRowText]}>{ formatPercentageText(value) }</Text>
      </View>
    );
  }, [color, borderStyle, typography]);

  const success = calculate();
  const successTwice = binomdist(2, 2, success);
  const reRollOnFail = binomdist(2, 1, success) + binomdist(2, 2, success);
  const failTwoOrMore = calculate(-2, true);
  const failOneOrMore = calculate(-1, true);
  const succeedOneOrMore = calculate(1);
  const succeedTwoOrMore = calculate(2);
  const succeedThreeOrMore = calculate(3);
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
    <>
      <TouchableOpacity style={[styles.skillRow, borderStyle]} onPress={toggleAdditionalRows}>
        <View style={styles.row}>
          <View style={[styles.skillBox, { backgroundColor: COLORS.skill[type].default }]}>
            <Text style={[typography.bigGameFont, styles.skillValue]}>
              { type !== 'wild' ? `${stat}` : '' }<ArkhamIcon name={type} size={28} color={COLORS.white} />
            </Text>
          </View>
          <Text style={typography.text}>{ formatPercentageText(success) }</Text>
        </View>
        <View style={[styles.row, { paddingRight: s }]}>
          <Text style={[typography.text, { fontSize: 22, paddingRight: s }]}>
            { boost >= 0 ? `+${boost}` : boost }
          </Text>
          <PlusMinusButtons
            count={boost}
            size={36}
            onIncrement={incBoost}
            onDecrement={decBoost}
            allowNegative
            color="dark"
          />
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={collapsed}>
        { rows.map((row, index) => {
          const evenRow = (index % 2) === 0;
          return renderAdditionalRow(row.title, row.value, evenRow);
        }) }
      </Collapsible>
    </>
  );
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
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  additionalRowText: {
    color: COLORS.white,
  },
  skillRow: {
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
