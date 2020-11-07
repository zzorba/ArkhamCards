import React, { useContext } from 'react';
import { map } from 'lodash';

import ChoiceListComponent, { ChoiceListComponentProps } from './ChoiceListComponent';
import ScenarioStepContext from '../ScenarioStepContext';
import Card from '@data/Card';

interface Props extends ChoiceListComponentProps {
  investigators?: Card[];
}

export default function InvestigatorChoicePrompt({ investigators, ...otherProps }: Props) {
  const { scenarioInvestigators, style: { colors } } = useContext(ScenarioStepContext);
  return (
    <ChoiceListComponent
      {...otherProps}
      items={map(investigators || scenarioInvestigators, investigator => {
        return {
          code: investigator.code,
          name: investigator.name,
          masculine: investigator.grammarGenderMasculine(),
          color: colors.faction[investigator.factionCode()].background,
        };
      })}
    />
  );
}
