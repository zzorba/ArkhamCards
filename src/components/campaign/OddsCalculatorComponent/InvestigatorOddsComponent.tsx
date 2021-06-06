import React, { useContext, useMemo } from 'react';
import { find, map } from 'lodash';
import { StyleSheet, Text, View } from 'react-native';

import ArkhamIcon from '@icons/ArkhamIcon';
import Switch from '@components/core/Switch';
import Card from '@data/types/Card';
import { ChaosBag, ChaosTokenValue, SpecialTokenValue } from '@app_constants';
import COLORS from '@styles/colors';
import SkillOddsRow from './SkillOddsRow';
import VariableTokenInput from './VariableTokenInput';
import { elderSign, modifiers } from './constants';
import { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useCounter, useFlag } from '@components/core/hooks';

export interface InvestigatorOddsProps {
  chaosBag: ChaosBag;
  specialTokenValues: SpecialTokenValue[];
  investigator: Card;
  testDifficulty: number;
}

export default function InvestigatorOddsComponent({ chaosBag, specialTokenValues, investigator, testDifficulty }: InvestigatorOddsProps) {
  const { borderStyle, colors, typography } = useContext(StyleContext);
  const [counterValue, increment, decrement] = useCounter(0, { min: 0 });
  const [switchValue, toggleSwitch] = useFlag(false);

  const elderSignEffect = useMemo(() => elderSign(investigator), [investigator]);
  const elderSignValue: ChaosTokenValue = useMemo(() => {
    switch (elderSignEffect.type) {
      case 'constant':
        return elderSignEffect.value;
      case 'counter':
        return counterValue;
      case 'switch':
        return elderSignEffect.values[switchValue ? 1 : 0];
    }
  }, [elderSignEffect, counterValue, switchValue]);

  const elderSignOptions = useMemo(() => {
    switch (elderSignEffect.type) {
      case 'constant':
        return null;
      case 'counter':
        return (
          <VariableTokenInput
            symbol="elder_sign"
            color={COLORS.darkBlue}
            value={counterValue}
            text={elderSignEffect.text}
            increment={increment}
            decrement={decrement}
          />
        );
      case 'switch':
        return (
          <View style={[styles.skillRow, borderStyle]}>
            <View style={styles.row}>
              <View style={styles.elderSignBox}>
                <ArkhamIcon
                  name="elder_sign"
                  size={28}
                  color={COLORS.white}
                />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={typography.small} numberOfLines={2}>
                { elderSignEffect.text }
              </Text>
            </View>
            <View style={[styles.row, { paddingRight: s }]}>
              <Switch
                value={switchValue}
                onValueChange={toggleSwitch}
              />
            </View>
          </View>
        );
    }
  }, [elderSignEffect, counterValue, switchValue, borderStyle, typography, increment, decrement, toggleSwitch]);

  const allSpecialTokenValues = useMemo(() => {
    const specialModifiers = modifiers(investigator);
    return map(specialTokenValues, value => {
      if (value.token === 'elder_sign') {
        return {
          ...value,
          value: elderSignValue,
        };
      }
      const modifier = find(specialModifiers, m => m.token === value.token);
      if (modifier) {
        return {
          ...value,
          value: modifier.value,
        };
      }
      return value;
    });
  }, [investigator, specialTokenValues, elderSignValue]);

  const willpower = investigator.skill_willpower || 0;
  const intellect = investigator.skill_intellect || 0;
  const combat = investigator.skill_combat || 0;
  const agility = investigator.skill_agility || 0;
  return (
    <>
      <View style={[styles.headerRow, { backgroundColor: colors.L20 }]}>
        <Text style={typography.text}>
          { investigator.name }
        </Text>
      </View>
      { elderSignOptions }
      <SkillOddsRow
        stat={willpower}
        type={'willpower'}
        testDifficulty={testDifficulty}
        chaosBag={chaosBag}
        specialTokenValues={allSpecialTokenValues}
      />
      <SkillOddsRow
        stat={intellect}
        type={'intellect'}
        testDifficulty={testDifficulty}
        chaosBag={chaosBag}
        specialTokenValues={allSpecialTokenValues}
      />
      <SkillOddsRow
        stat={combat}
        type={'combat'}
        testDifficulty={testDifficulty}
        chaosBag={chaosBag}
        specialTokenValues={allSpecialTokenValues}
      />
      <SkillOddsRow
        stat={agility}
        type={'agility'}
        testDifficulty={testDifficulty}
        chaosBag={chaosBag}
        specialTokenValues={allSpecialTokenValues}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    paddingTop: 5,
    paddingRight: 15,
    paddingBottom: 5,
    paddingLeft: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  elderSignBox: {
    height: 50,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: COLORS.darkBlue,
  },
  skillRow: {
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
