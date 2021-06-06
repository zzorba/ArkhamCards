import React, { useCallback, useContext } from 'react';
import { msgid, ngettext, t } from 'ttag';

import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';
import SetupStepWrapper from '../../SetupStepWrapper';
import CampaignGuideContext from '../../CampaignGuideContext';
import { BranchStep, CampaignLogCountCondition } from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';

interface Props {
  step: BranchStep;
  condition: CampaignLogCountCondition;
  campaignLog: GuidedCampaignLog;
}

// TODO: fix this.
// BUT IN WHAT WAY PAST DANIEL!
export default function CampaignLogCountConditionComponent({ step, condition, campaignLog }: Props) {
  const { campaignGuide } = useContext(CampaignGuideContext);
  const getPrompt = useCallback((count: number) => {
    const logEntry = campaignGuide.logEntry(condition.section, condition.id);
    switch (logEntry.type) {
      case 'section_count':
        if (campaignLog.countSections[condition.section]) {
          return ngettext(
            msgid`Check Campaign Log. Because there is ${count} mark under '${logEntry.section}'`,
            `Check Campaign Log. Because there are ${count} marks under '${logEntry.section}'`,
            count
          );
        }
        return ngettext(
          msgid`Check Campaign Log. Because there is ${count} entry under '${logEntry.section}'`,
          `Check Campaign Log. Because there are ${count} entries under '${logEntry.section}'`,
          count
        );
      case 'text': {
        const entry = logEntry.text.replace('#X#', `${count}`);
        return t`Check Campaign Log. Because <i>${entry}</i>`;
      }
      default:
        return 'Some other count condition';
    }
  }, [campaignGuide, condition, campaignLog]);

  if (condition.section === 'hidden') {
    return null;
  }
  const count = campaignLog.count(condition.section, condition.id);
  return (
    <SetupStepWrapper bulletType={step.bullet_type}>
      <CampaignGuideTextComponent
        text={step.text || getPrompt(count)}
      />
    </SetupStepWrapper>
  );
}
