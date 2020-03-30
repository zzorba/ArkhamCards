import React from 'react';
import { map } from 'lodash';

import CheckListComponent from './CheckListComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import { FACTION_LIGHT_GRADIENTS } from 'constants';

interface Props {
  id: string;
  checkText: string;
  defaultState?: boolean;
  requiredTotal?: number;
}

export default class InvestigatorCounterComponent extends React.Component<Props> {
  static contextType = ScenarioGuideContext;
  context!: ScenarioGuideContextType;

  render() {
    const { id, checkText, requiredTotal, defaultState } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ investigatorDecks }: ScenarioGuideContextType) => {
          return (
            <CheckListComponent
              id={id}
              checkText={checkText}
              defaultState={defaultState}
              items={map(investigatorDecks, ({ investigator }) => {
                return {
                  code: investigator.code,
                  name: investigator.name,
                  tintColor: FACTION_LIGHT_GRADIENTS[investigator.factionCode()][0],
                };
              })}
              requiredTotal={requiredTotal}
            />
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}
