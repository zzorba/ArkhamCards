import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { find, keys, map, sumBy } from 'lodash';
import { t } from 'ttag';

import SupplyComponent from './SupplyComponent';
import { FACTION_COLORS } from 'constants';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import SetupStepWrapper from '../../SetupStepWrapper';
import CardTextComponent from 'components/card/CardTextComponent';
import { SuppliesInput } from 'data/scenario/types';
import Card from 'data/Card';
import typography from 'styles/typography';

interface Props {
  id: string;
  text?: string;
  input: SuppliesInput;
}

interface State {
  counts: {
    [code: string]: {
      [id: string]: number ;
    };
  };
}

export default class SuppliesPrompt extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      counts: {},
    };
  }

  _incrementSupply = (code: string, supply: string) => {
    this.setState(state => {
      const investigatorCounts = state.counts[code] || {};
      const count = investigatorCounts[supply] || 0;
      return {
        counts: {
          ...state.counts,
          [code]: {
            ...investigatorCounts,
            [supply]: count + 1,
          },
        },
      };
    });
  };

  _decrementSupply = (code: string, supply: string) => {
    this.setState(state => {
      const investigatorCounts = state.counts[code] || {};
      const count = investigatorCounts[supply] || 0;
      return {
        counts: {
          ...state.counts,
          [code]: {
            ...investigatorCounts,
            [supply]: Math.max(count - 1, 0),
          },
        },
      };
    });
  };

  renderInvestigator(investigator: Card, investigatorCount: number) {
    const { input } = this.props;
    const counts = this.state.counts[investigator.code] || {};
    const playerCount = Math.max(Math.min(investigatorCount, 4), 1);
    const total = input.points[playerCount - 1];

    const spent = sumBy(keys(counts), id => {
      const count = counts[id];
      const supply = find(input.supplies, supply => supply.id === id);
      return count * (supply ? supply.cost : 1);
    });
    const backgroundColor = FACTION_COLORS[investigator.factionCode()];
    return (
      <View style={[styles.investigatorRow, { backgroundColor }]}>
        <View>
          <Text style={[typography.text, styles.investigatorText]}>
            { investigator.name }
          </Text>
        </View>
        <View>
          <Text style={[typography.text, styles.investigatorText]}>
            { t`${spent} of ${total}` }
          </Text>
        </View>
      </View>
    );
  }

  render() {
    const { text, input } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ investigatorDecks }: ScenarioGuideContextType) => {
          const investigatorCount = investigatorDecks.length;
          return (
            <>
              <SetupStepWrapper>
                { !!text && <CardTextComponent text={text} /> }
              </SetupStepWrapper>
              { map(investigatorDecks, ({ investigator }, idx) => {
                const counts = this.state.counts[investigator.code] || {};
                return (
                  <View key={idx}>
                    { this.renderInvestigator(investigator, investigatorCount) }
                    { map(input.supplies, (supply, idx2) => (
                      <SupplyComponent
                        key={idx2}
                        investigator={investigator}
                        supply={supply}
                        count={counts[supply.id] || 0}
                        inc={this._incrementSupply}
                        dec={this._decrementSupply}
                      />
                    )) }
                  </View>
                );
              }) }
              <Button title={t`Save`} onPress={this._save} />
            </>
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  investigatorText: {
    color: '#FFF',
    fontWeight: '700',
  },
  investigatorRow: {
    padding: 8,
    paddingLeft: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
