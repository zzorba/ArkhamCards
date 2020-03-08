import React from 'react';
import { find, map } from 'lodash';
import { StyleSheet, Text, View } from 'react-native';

import ArkhamIcon from 'icons/ArkhamIcon';
import Switch from 'components/core/Switch';
import Card from 'data/Card';
import typography from 'styles/typography';
import { ChaosBag, ChaosTokenValue, SpecialTokenValue } from 'constants';
import { COLORS } from 'styles/colors';
import SkillOddsRow from './SkillOddsRow';
import VariableTokenInput from './VariableTokenInput';
import { InvestigatorElderSign } from './types';
import { elderSign, modifiers } from './constants';
import { s } from 'styles/space';

export interface InvestigatorOddsProps {
  chaosBag: ChaosBag;
  specialTokenValues: SpecialTokenValue[];
  difficulty?: string;
  investigator: Card;
  testDifficulty: number;
}

type Props = InvestigatorOddsProps;

interface State {
  counterValue: number;
  switchValue: boolean;
}

export default class InvestigatorOddsComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      counterValue: 0,
      switchValue: false,
    };
  }

  _increment = () => {
    this.setState((state) => {
      return {
        counterValue: state.counterValue + 1,
      };
    });
  };

  _decrement = () => {
    this.setState((state) => {
      return {
        counterValue: Math.max(state.counterValue - 1, 0),
      };
    });
  };

  _toggle = () => {
    this.setState((state) => {
      return {
        switchValue: !state.switchValue,
      };
    });
  }

  renderElderSignOptions(elderSignEffect: InvestigatorElderSign) {
    const { counterValue, switchValue } = this.state;
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
            increment={this._increment}
            decrement={this._decrement}
          />
        );
      case 'switch':
        return (
          <View style={styles.skillRow}>
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
              <Text style={typography.label} numberOfLines={2}>
                { elderSignEffect.text }
              </Text>
            </View>
            <View style={[styles.row, { paddingRight: s }]}>
              <Switch
                value={switchValue}
                onValueChange={this._toggle}
              />
            </View>
          </View>
        );
    }
  }

  elderSignValue(elderSignEffect: InvestigatorElderSign): ChaosTokenValue {
    const {
      counterValue,
      switchValue,
    } = this.state;
    switch (elderSignEffect.type) {
      case 'constant':
        return elderSignEffect.value;
      case 'counter':
        return counterValue;
      case 'switch':
        return elderSignEffect.values[switchValue ? 1 : 0];
    }
  }

  specialTokenValues(elderSignEffect: InvestigatorElderSign) {
    const {
      investigator,
      specialTokenValues,
    } = this.props;
    const specialModifiers = modifiers(investigator);

    return map(specialTokenValues, value => {
      if (value.token === 'elder_sign') {
        return {
          ...value,
          value: this.elderSignValue(elderSignEffect),
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
  }

  render() {
    const {
      investigator,
      testDifficulty,
      chaosBag,
    } = this.props;

    const willpower = investigator.skill_willpower || 0;
    const intellect = investigator.skill_intellect || 0;
    const combat = investigator.skill_combat || 0;
    const agility = investigator.skill_agility || 0;
    const elderSignEffect = elderSign(investigator);
    const specialTokenValues = this.specialTokenValues(elderSignEffect);
    return (
      <React.Fragment>
        <View style={[styles.headerRow]}>
          <Text style={typography.text}>
            { investigator.name }
          </Text>
        </View>
        { this.renderElderSignOptions(elderSignEffect) }
        <SkillOddsRow
          stat={willpower}
          type={'willpower'}
          testDifficulty={testDifficulty}
          chaosBag={chaosBag}
          specialTokenValues={specialTokenValues}
        />
        <SkillOddsRow
          stat={intellect}
          type={'intellect'}
          testDifficulty={testDifficulty}
          chaosBag={chaosBag}
          specialTokenValues={specialTokenValues}
        />
        <SkillOddsRow
          stat={combat}
          type={'combat'}
          testDifficulty={testDifficulty}
          chaosBag={chaosBag}
          specialTokenValues={specialTokenValues}
        />
        <SkillOddsRow
          stat={agility}
          type={'agility'}
          testDifficulty={testDifficulty}
          chaosBag={chaosBag}
          specialTokenValues={specialTokenValues}
        />
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
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
});
