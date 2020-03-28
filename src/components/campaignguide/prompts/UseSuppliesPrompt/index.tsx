import React from 'react';
import { StyleSheet } from 'react-native';

import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import { BulletType, UseSuppliesInput } from 'data/scenario/types';

interface Props {
  id: string;
  bulletType?: BulletType;
  text?: string;
  input: UseSuppliesInput;
}

interface State {
  counts: {
    [code: string]: {
      [id: string]: number ;
    };
  };
}

export default class UseSuppliesPrompt extends React.Component<Props, State> {
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
    const { input } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ investigatorDecks, scenarioState }: ScenarioGuideContextType) => {
          switch (input.investigator) {
            case 'all':
              // Basically 2 sequential choices.
              // 1) How many "supply" to consume
              // 2) If count != players, who doesn't get any?
              return null;
            case 'any':
              // Basically 2 sequential choices.
              // 1) Players who have supply can choose to use it.
              // 2) If so, they resolve the effect (which is an investigator choice).
              return null;
            case 'choice':
              // Single choice, of players with Gasoline, must choose one.
                return null;
          }
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
