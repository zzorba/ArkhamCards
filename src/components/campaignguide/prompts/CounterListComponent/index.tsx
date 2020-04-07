import React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { forEach, map, sum } from 'lodash';
import { t } from 'ttag';

import CounterListItemComponent from './CounterListItemComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import { NumberChoices } from 'actions/types';
import typography from 'styles/typography';

export interface CounterItem {
  code: string;
  name: string;
  tintColor?: string;
  limit?: number;
}

interface Props {
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

export default class CounterListComponent extends React.Component<Props, State> {
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
    return (
      <View style={styles.buttonWrapper}>
        { disabled && requiredTotal !== undefined ? (
          <Button
            title={currentTotal > requiredTotal ? t`Too many` : t`Not enough`}
            onPress={this._save}
            disabled
          />
        ) : (
          <Button
            title={t`Proceed`}
            onPress={this._save}
            disabled={disabled}
          />
        ) }
      </View>
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
    const { id, items, countText } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState }: ScenarioGuideContextType) => {
          const choiceList = scenarioState.numberChoices(id);
          const hasDecision = choiceList !== undefined;
          return (
            <View>
              <View style={styles.prompt}>
                <Text style={typography.mediumGameFont}>
                  { countText }
                </Text>
              </View>
              { map(items, ({ code, name, limit, tintColor }, idx) => {
                const value = this.getValue(code, choiceList);
                return (
                  <CounterListItemComponent
                    key={idx}
                    value={value}
                    code={code}
                    name={name}
                    onInc={this._onInc}
                    onDec={this._onDec}
                    limit={limit}
                    editable={!hasDecision}
                    tintColor={tintColor}
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

const styles = StyleSheet.create({
  prompt: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingRight: 16,
    justifyContent: 'flex-end',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#888',
  },
  buttonWrapper: {
    padding: 8,
  },
});
