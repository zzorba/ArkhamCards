import React, { useContext } from 'react';
import { map } from 'lodash';

import ChoiceListComponent, { ChoiceListComponentProps } from './ChoiceListComponent';
import ScenarioStepContext from '../ScenarioStepContext';
import Card from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import TraumaSummary from '@components/campaign/TraumaSummary';

interface Props extends ChoiceListComponentProps {
  investigators?: Card[];
  includeTrauma?: boolean;
}

export default function InvestigatorChoicePrompt({ investigators, includeTrauma, ...otherProps }: Props) {
  const { scenarioInvestigators, campaignLog } = useContext(ScenarioStepContext);
  const { colors } = useContext(StyleContext);
  return (
    <ChoiceListComponent
      {...otherProps}
      items={map(investigators || scenarioInvestigators, investigator => {
        return {
          code: investigator.code,
          investigator,
          name: investigator.name,
          gender: investigator.gender,
          color: colors.faction[investigator.factionCode()].background,
          component: includeTrauma ? (
            <TraumaSummary
              trauma={campaignLog.traumaAndCardData(investigator.code)}
              investigator={investigator}
              whiteText
              hideNone
            />
          ) : undefined,
        };
      })}
    />
  );
}
