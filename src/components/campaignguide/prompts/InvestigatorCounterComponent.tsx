import React from 'react';
import { map } from 'lodash';

import CounterListComponent from './CounterListComponent';
import ScenarioStepContext, { ScenarioStepContextType } from '../ScenarioStepContext';
import { FACTION_LIGHT_GRADIENTS } from 'constants';

interface Props {
  id: string;
  limits?: {
    [code: string]: number;
  };
  requiredTotal?: number;
}

export default class InvestigatorCounterComponent extends React.Component<Props> {
  render() {
    const { id, limits, requiredTotal } = this.props;
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
                  tintColor: FACTION_LIGHT_GRADIENTS[investigator.factionCode()][0],
                  limit: limits ? limits[investigator.code] : undefined,
                };
              })}
              requiredTotal={requiredTotal}
            />
          );
        } }
      </ScenarioStepContext.Consumer>
    );
  }
}
