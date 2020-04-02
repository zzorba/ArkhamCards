import React from 'react';
import { map } from 'lodash';

import ChoiceListComponent, { ChoiceListComponentProps } from './ChoiceListComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import { FACTION_COLORS, FACTION_LIGHT_GRADIENTS } from 'constants';
import { InvestigatorDeck } from 'data/scenario';

interface Props extends ChoiceListComponentProps {
  investigatorDecks?: InvestigatorDeck[];
}

export default class InvestigatorChoicePrompt extends React.Component<Props> {
  static contextType = ScenarioGuideContext;
  context!: ScenarioGuideContextType;

  render() {
    return (
      <ScenarioGuideContext.Consumer>
        { (context: ScenarioGuideContextType) => {
          return (
            <ChoiceListComponent
              {...this.props}
              items={map(this.props.investigatorDecks || context.investigatorDecks, ({ investigator }) => {
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
