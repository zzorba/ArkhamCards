import React from 'react';
import { map } from 'lodash';

import ChoiceListComponent, { ChoiceListComponentProps } from './ChoiceListComponent';
import ScenarioStepContext, { ScenarioStepContextType } from '../ScenarioStepContext';
import { FACTION_COLORS, FACTION_LIGHT_GRADIENTS } from 'constants';
import Card from 'data/Card';

interface Props extends ChoiceListComponentProps {
  investigators?: Card[];
}

export default function InvestigatorChoicePrompt(
  { investigators, ...otherProps }: Props
) {
  return (
    <ScenarioStepContext.Consumer>
      { (context: ScenarioStepContextType) => {
        return (
          <ChoiceListComponent
            {...otherProps}
            items={map(investigators || context.scenarioInvestigators, investigator => {
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
    </ScenarioStepContext.Consumer>
  );
}
