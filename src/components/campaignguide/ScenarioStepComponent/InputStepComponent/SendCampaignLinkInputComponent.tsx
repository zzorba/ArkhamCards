import React, { useContext, useEffect } from 'react';

import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import { SendCampaignLinkInput, BulletType } from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';

interface Props {
  id: string;
  input: SendCampaignLinkInput;
  campaignLog: GuidedCampaignLog;
  text?: string;
  bulletType?: BulletType;
}

export default function SendCampaignLinkInputComponent({ id, input, campaignLog, text, bulletType }: Props) {
  const { scenarioState } = useContext(ScenarioGuideContext);
  useEffect(() => {
    if (campaignLog.linked) {
      const sentDecision = scenarioState.campaignLink('send', input.id);
      if (sentDecision !== input.decision) {
        scenarioState.setCampaignLink(input.id, input.decision);
      }
    }
  }, []);

  if (text) {
    return (
      <SetupStepWrapper bulletType={bulletType}>
        <CampaignGuideTextComponent text={text} />
      </SetupStepWrapper>
    );
  }
  if (campaignLog.linked) {
    // In linked mode we're either hidden or show bullet_type + text.
    return null;
  }

  // If we're in 'split' mode, either give them an instruction to tell the
  // the others, or do nothing if prompt is blank.
  if (!input.prompt) {
    return null;
  }
  return (
    <SetupStepWrapper bulletType={bulletType}>
      <CampaignGuideTextComponent text={input.prompt} />
    </SetupStepWrapper>
  );
}
