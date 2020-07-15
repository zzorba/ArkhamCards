import React from 'react';
import { map } from 'lodash';

import ChoiceListComponent, { ChoiceListComponentProps } from './ChoiceListComponent';
import ScenarioStepContext, { ScenarioStepContextType } from '../ScenarioStepContext';
import Card from '@data/Card';
import COLORS from '@styles/colors';

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
                color: {
                  tint: COLORS.faction[investigator.factionCode()].pastelBackground,
                  primary: COLORS.faction[investigator.factionCode()].background,
                },
              };
            })}
          />
        );
      } }
    </ScenarioStepContext.Consumer>
  );
}
