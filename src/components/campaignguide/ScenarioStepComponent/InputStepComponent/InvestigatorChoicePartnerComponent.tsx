import React, { useContext, useMemo } from 'react';
import { flatMap } from 'lodash';
import { t } from 'ttag';

import { InvestigatorPartnerChoiceInput } from '@data/scenario/types';
import useCardList from '@components/card/useCardList';
import { UniversalChoices } from '@data/scenario';
import InvestigatorChoicePrompt from '@components/campaignguide/prompts/InvestigatorChoicePrompt';
import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import { ActivityIndicator } from 'react-native';
import InputWrapper from '@components/campaignguide/prompts/InputWrapper';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';

interface Props {
  id: string;
  input: InvestigatorPartnerChoiceInput;
}
export default function InvestigatorChoicePartnerComponent({ id, input }: Props) {
  const [cards, loading] = useCardList(input.cards, 'encounter');
  const { campaignLog } = useContext(ScenarioStepContext);
  const { scenarioState } = useContext(ScenarioGuideContext);
  const options: UniversalChoices = useMemo(() => {
    return {
      type: 'universal',
      choices: flatMap(cards, c => {
        const trauma = campaignLog.traumaAndCardData(c.code);
        if (c.eliminated(trauma)) {
          return [];
        }
        return {
          id: c.code,
          text: c.name,
          describe: c.subname,
          trauma: trauma,
          card: c,
        };
      }),
    };
  }, [cards, campaignLog]);
  const hasDecision = scenarioState.stringChoices(id) !== undefined;
  const investigators = useMemo(() => campaignLog.investigatorCodes(false), [campaignLog]);
  if (loading) {
    return (
      <InputWrapper
        editable={!hasDecision}
        disabledText={t`Loading`}
        title={input.prompt}
        titleStyle="header"
      >
        <ActivityIndicator animating size="small" />
      </InputWrapper>
    );
  }
  return (
    <InvestigatorChoicePrompt
      id={id}
      promptType="header"
      text={input.prompt}
      unique
      optional={options.choices.length < investigators.length}
      options={options}
      loading={loading}
    />
  );
}