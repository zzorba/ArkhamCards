import React, { useCallback, useContext } from 'react';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import SetupStepWrapper from '../SetupStepWrapper';
import ScenarioGuideContext from '../ScenarioGuideContext';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import { BulletType } from '@data/scenario/types';
import BinaryResult from '../BinaryResult';

interface Props {
  id: string;
  bulletType?: BulletType;
  text?: string;
}

export default function BinaryPrompt({ id, bulletType, text }: Props) {
  const { scenarioState } = useContext(ScenarioGuideContext);
  const yes = useCallback(() => {
    scenarioState.setDecision(id, true);
  }, [id, scenarioState]);

  const no = useCallback(() => {
    scenarioState.setDecision(id, false);
  }, [id, scenarioState]);

  const decision = scenarioState.decision(id);
  return decision === undefined ? (
    <>
      <SetupStepWrapper bulletType={bulletType}>
        { !!text && <CampaignGuideTextComponent text={text} /> }
      </SetupStepWrapper>
      <BasicButton title={t`Yes`} onPress={yes} />
      <BasicButton title={t`No`} onPress={no} />
    </>
  ) : (
    <BinaryResult
      bulletType={bulletType}
      prompt={text}
      result={decision}
    />
  );
}
