import React from 'react';
import { map } from 'lodash';

import CounterListComponent from './CounterListComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import { FACTION_LIGHT_GRADIENTS } from 'constants';

interface Props {
  id: string;
  limits?: {
    [code: string]: number;
  };
}

export default class InvestigatorCounterComponent extends React.Component<Props> {
  static contextType = ScenarioGuideContext;
  context!: ScenarioGuideContextType;

  render() {
    const { id, limits } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ investigatorDecks }: ScenarioGuideContextType) => {
          return (
            <CounterListComponent
              id={id}
              items={map(investigatorDecks, ({ investigator }) => {
                return {
                  code: investigator.code,
                  name: investigator.name,
                  tintColor: FACTION_LIGHT_GRADIENTS[investigator.factionCode()][0],
                  limit: limits ? limits[investigator.code] : undefined,
                };
              })}
            />
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}
