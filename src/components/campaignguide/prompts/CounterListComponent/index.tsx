import React from 'react';
import { Button } from 'react-native';
import { forEach, map } from 'lodash';
import { t } from 'ttag';

import CounterListItemComponent from './CounterListItemComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import { ListChoices } from 'actions/types';

export interface CounterItem {
  code: string;
  name: string;
  tintColor?: string;
  limit?: number;
}

interface Props {
  id: string;
  items: CounterItem[];
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
    const choices: ListChoices = {};
    forEach(counts, (value, code) => {
      choices[code] = [value];
    });
    this.context.scenarioState.setChoiceList(id, choices);
  };

  renderSaveButton(hasDecision: boolean) {
    if (hasDecision) {
      return null;
    }
    return (
      <Button
        title={t`Save`}
        onPress={this._save}
      />
    );

  }

  render() {
    const { id, items } = this.props;
    const { counts } = this.state;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState }: ScenarioGuideContextType) => {
          const hasDecision = scenarioState.choiceList(id) !== undefined;
          return (
            <>
              { map(items, ({ code, name, limit, tintColor }, idx) => {
                const value = counts[code] || 0;
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
            </>
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}
