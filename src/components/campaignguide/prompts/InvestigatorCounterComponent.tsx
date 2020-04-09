import React from 'react';
import { map } from 'lodash';

import CounterListComponent from './CounterListComponent';
import ScenarioStepContext, { ScenarioStepContextType } from '../ScenarioStepContext';
import { FACTION_LIGHT_GRADIENTS, FACTION_COLORS } from 'constants';

interface Props {
  id: string;
  limits?: {
    [code: string]: number;
  };
  countText?: string;
  requiredTotal?: number;
}

export default class InvestigatorCounterComponent extends React.Component<Props> {
  render() {
    const { id, limits, requiredTotal, countText } = this.props;
    return (
      <ScenarioStepContext.Consumer>
        { ({ scenarioInvestigators }: ScenarioStepContextType) => {
          return (
            <CounterListComponent
              id={id}
              items={map(scenarioInvestigators, investigator => {
                return {
                  code: investigator.code,
                  name: investigator.name,
                  color: {
                    tint: FACTION_LIGHT_GRADIENTS[investigator.factionCode()][0],
                    primary: FACTION_COLORS[investigator.factionCode()],
                  },
                  limit: limits ? limits[investigator.code] : undefined,
                };
              })}
              countText={countText}
              requiredTotal={requiredTotal}
            />
          );
        } }
      </ScenarioStepContext.Consumer>
    );
  }
}
