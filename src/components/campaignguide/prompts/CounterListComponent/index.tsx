import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { forEach, map, sum } from 'lodash';
import { t } from 'ttag';

import withStyles, { StylesProps } from '@components/core/withStyles';
import BasicButton from '@components/core/BasicButton';
import CounterListItemComponent from './CounterListItemComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import { NumberChoices } from '@actions/types';
import typography from '@styles/typography';
import space from '@styles/space';
import COLORS from '@styles/colors';

export interface CounterItem {
  code: string;
  name: string;
  description?: string;
  color?: string;
  limit?: number;
}

interface OwnProps {
  id: string;
  items: CounterItem[];
  countText?: string;
  requiredTotal?: number;
}

interface State {
  counts: {
    [code: string]: number;
  };
}

type Props = OwnProps & StylesProps;

class CounterListComponent extends React.Component<Props, State> {
  static contextType = ScenarioGuideContext;
  context!: ScenarioGuideContextType;

  constructor(props: Props) {
    super(props);

    this.state = {
      counts: {},
    };
  }

  _onInc = (
    code: string,
    limit?: number
  ) => {
    this.setState(state => {
      const value = (state.counts[code] || 0) + 1;
      return {
        counts: {
          ...state.counts,
          [code]: limit !== undefined ? Math.min(limit, value) : value,
        },
      };
    });
  };

  _onDec = (
    code: string
  ) => {
    this.setState(state => {
      const value = state.counts[code] || 0;
      return {
        counts: {
          ...state.counts,
          [code]: Math.max(0, value - 1),
        },
      };
    });
  };

  _save = () => {
    const { id } = this.props;
    const { counts } = this.state;
    const choices: NumberChoices = {};
    forEach(counts, (value, code) => {
      choices[code] = [value];
    });
    this.context.scenarioState.setNumberChoices(
      id,
      choices
    );
  };

  renderSaveButton(hasDecision: boolean) {
    const { requiredTotal } = this.props;
    const { counts } = this.state;
    if (hasDecision) {
      return null;
    }
    const currentTotal = sum(map(counts));
    const disabled = (requiredTotal !== undefined) && currentTotal !== requiredTotal;
    return disabled && requiredTotal !== undefined ? (
      <BasicButton
        title={currentTotal > requiredTotal ? t`Too many` : t`Not enough`}
        onPress={this._save}
        disabled
      />
    ) : (
      <BasicButton
        title={t`Proceed`}
        onPress={this._save}
        disabled={disabled}
      />
    );
  }

  getValue(code: string, choiceList?: NumberChoices): number {
    const { counts } = this.state;
    if (choiceList === undefined) {
      return counts[code] || 0;
    }
    const investigatorCount = choiceList[code];
    if (!investigatorCount || !investigatorCount.length) {
      return 0;
    }
    return investigatorCount[0] || 0;
  }

  render() {
    const { id, items, countText, gameFont } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState }: ScenarioGuideContextType) => {
          const choiceList = scenarioState.numberChoices(id);
          const hasDecision = choiceList !== undefined;
          return (
            <View>
              <View style={[
                styles.prompt,
                space.paddingTopS,
                space.paddingRightM,
              ]}>
                <Text style={[typography.mediumGameFont, { fontFamily: gameFont }]}>
                  { countText }
                </Text>
              </View>
              { map(items, ({ code, name, description, limit, color }, idx) => {
                const value = this.getValue(code, choiceList);
                return (
                  <CounterListItemComponent
                    key={idx}
                    value={value}
                    code={code}
                    name={name}
                    description={description}
                    onInc={this._onInc}
                    onDec={this._onDec}
                    limit={limit}
                    editable={!hasDecision}
                    color={color}
                  />
                );
              }) }
              { this.renderSaveButton(hasDecision) }
            </View>
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}

export default withStyles(CounterListComponent);

const styles = StyleSheet.create({
  prompt: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
  },
});
