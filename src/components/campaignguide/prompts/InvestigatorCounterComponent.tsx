import React, { useContext } from 'react';
import { map } from 'lodash';

import CounterListComponent from './CounterListComponent';
import ScenarioStepContext from '../ScenarioStepContext';

interface Props {
  id: string;
  limits?: {
    [code: string]: number;
  };
  countText?: string;
  requiredTotal?: number;
  description?: {
    [code: string]: string;
  };
}

export default function InvestigatorCounterComponent({
  id, limits, requiredTotal, countText, description,
}: Props) {
  const { scenarioInvestigators, style: { colors } } = useContext(ScenarioStepContext);
  return (
    <CounterListComponent
      id={id}
      items={map(scenarioInvestigators, investigator => {
        return {
          code: investigator.code,
          name: investigator.name,
          color: colors.faction[investigator.factionCode()].background,
          limit: limits ? limits[investigator.code] : undefined,
          description: description ? description[investigator.code] : undefined,
        };
      })}
      countText={countText}
      requiredTotal={requiredTotal}
    />
  );
}
