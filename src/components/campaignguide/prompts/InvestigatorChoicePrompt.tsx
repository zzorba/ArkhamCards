import React from 'react';
import { map } from 'lodash';

import ChoiceListComponent, { ChoiceListComponentProps } from './ChoiceListComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import { FACTION_COLORS, FACTION_LIGHT_GRADIENTS } from 'constants';

type Props = ChoiceListComponentProps;

export default class InvestigatorChoicePrompt extends React.Component<Props> {
  static contextType = ScenarioGuideContext;
  context!: ScenarioGuideContextType;

  render() {
    return (
      <ScenarioGuideContext.Consumer>
        { ({ investigatorDecks }: ScenarioGuideContextType) => {
          return (
            <ChoiceListComponent
              {...this.props}
              items={map(investigatorDecks, ({ investigator }) => {
                return {
                  code: investigator.code,
                  name: investigator.name,
                  tintColor: FACTION_LIGHT_GRADIENTS[investigator.factionCode()][0],
                  primaryColor: FACTION_COLORS[investigator.factionCode()],
                };
              })}
            />
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}
