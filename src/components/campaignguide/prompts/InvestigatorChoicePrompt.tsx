import React, { useContext } from 'react';
import { map } from 'lodash';

import ChoiceListComponent, { ChoiceListComponentProps } from './ChoiceListComponent';
import ScenarioStepContext from '../ScenarioStepContext';
import StyleContext from '@styles/StyleContext';
import TraumaSummary from '@components/campaign/TraumaSummary';
import { CampaignInvestigator } from '@data/scenario/GuidedCampaignLog';

interface Props extends ChoiceListComponentProps {
  investigators?: CampaignInvestigator[];
  includeTrauma?: boolean;
}

export default function InvestigatorChoicePrompt({ investigators, includeTrauma, ...otherProps }: Props) {
  const { scenarioInvestigators, campaignLog } = useContext(ScenarioStepContext);
  const { colors } = useContext(StyleContext);
  return (
    <ChoiceListComponent
      {...otherProps}
      items={map(investigators ?? scenarioInvestigators, investigator => {
        return {
          code: investigator.code,
          investigator,
          name: investigator.card.name,
          gender: investigator.card.gender,
          color: colors.faction[investigator.card.factionCode()].background,
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
