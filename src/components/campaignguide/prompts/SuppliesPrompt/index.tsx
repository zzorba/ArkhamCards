import React from 'react';
import { Button, View } from 'react-native';
import { forEach, keys, map, sumBy } from 'lodash';
import { t } from 'ttag';

import InvestigatorNameRow from '../InvestigatorNameRow';
import SupplyComponent from './SupplyComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import SetupStepWrapper from '../../SetupStepWrapper';
import CardTextComponent from 'components/card/CardTextComponent';
import { BulletType, Supply, SuppliesInput } from 'data/scenario/types';

interface Props {
  id: string;
  bulletType?: BulletType;
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
  static contextType = ScenarioGuideContext;
  context!: ScenarioGuideContextType;

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

  _save = () => {
    const { id } = this.props;
    const { counts } = this.state;
    this.context.scenarioState.setSupplies(id, counts);
  };

  render() {
    const { id, text, input, bulletType } = this.props;
    const supplies: {
      [id: string]: Supply;
    } = {};
    forEach(input.supplies, supply => {
      supplies[supply.id] = supply;
    });

    return (
      <ScenarioGuideContext.Consumer>
        { ({ investigatorDecks, scenarioState }: ScenarioGuideContextType) => {
          const playerCount = Math.max(Math.min(investigatorDecks.length, 4), 1);
          const total = input.points[playerCount - 1];
          const suppliesInput = scenarioState.supplies(id);
          const supplyCounts = suppliesInput !== undefined ? suppliesInput : this.state.counts;
          return (
            <>
              <SetupStepWrapper bulletType={bulletType}>
                { !!text && <CardTextComponent text={text} /> }
              </SetupStepWrapper>
              { map(investigatorDecks, ({ investigator }, idx) => {
                const counts = supplyCounts[investigator.code] || {};
                const spent = sumBy(keys(counts), id => {
                  const count = counts[id];
                  const supply = supplies[id];
                  return count * (supply ? supply.cost : 1);
                });
                return (
                  <View key={idx}>
                    <InvestigatorNameRow
                      investigator={investigator}
                      detail={suppliesInput !== undefined ? undefined : t`${spent} of ${total}`}
                    />
                    { map(input.supplies, (supply, idx2) => {
                      const count = counts[supply.id] || 0;
                      return (suppliesInput === undefined || count > 0) && (
                        <SupplyComponent
                          key={idx2}
                          investigator={investigator}
                          supply={supply}
                          count={count}
                          inc={this._incrementSupply}
                          dec={this._decrementSupply}
                          remainingPoints={Math.max(total - spent, 0)}
                          editable={suppliesInput === undefined}
                        />
                      );
                    }) }
                  </View>
                );
              }) }
              { (suppliesInput === undefined) && (
                <Button
                  title={t`Save`}
                  onPress={this._save}
                />
              ) }
            </>
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}
