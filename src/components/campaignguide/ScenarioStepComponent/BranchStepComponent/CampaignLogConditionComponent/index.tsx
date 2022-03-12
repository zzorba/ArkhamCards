import React, { useContext } from 'react';
import { Text } from 'react-native';
import { find, every } from 'lodash';
import { t } from 'ttag';

import CampaignLogCardConditionComponent from './CampaignLogCardConditionComponent';
import BinaryResult from '../../../BinaryResult';
import CampaignGuideContext from '../../../CampaignGuideContext';
import {
  BranchStep,
  CampaignLogCondition,
  CampaignLogCardsCondition,
} from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';

interface Props {
  step: BranchStep;
  condition: CampaignLogCondition | CampaignLogCardsCondition;
  campaignLog: GuidedCampaignLog;
}

export default function CampaignLogConditionComponent({ step, condition, campaignLog }: Props) {
  const { campaignGuide } = useContext(CampaignGuideContext);
  if (every(condition.options, option => option.boolCondition !== undefined)) {
    // It's a binary prompt.
    if (condition.id) {
      const logEntry = campaignGuide.logEntry(condition.section, condition.id);
      if (!logEntry) {
        return (
          <Text>
            Unknown campaign log { condition.section }.{ condition.id }
          </Text>
        );
      }
      switch (logEntry.type) {
        case 'text': {
          const prompt = step.text ||
            (logEntry.section === 'campaign_notes' ?
              t`Check Campaign Log. <i>If ${logEntry.text}</i>` :
              t`Check ${logEntry.section}. <i>If ${logEntry.text}</i>`);

          const result = campaignLog.check(condition.section, condition.id);
          const negativeResult = condition.options.length === 1 && condition.options[0].boolCondition === false;
          return (
            <BinaryResult
              prompt={prompt}
              result={negativeResult ? !result : result}
              bulletType={step.bullet_type}
            />
          );
        }
        case 'card': {
          return (
            <CampaignLogCardConditionComponent
              step={step}
              entry={logEntry}
              condition={condition}
              campaignLog={campaignLog}
            />
          );
        }
      }
    }
  }
  // Not a binary condition.
  return (
    <Text>
      A more complex Campaign Log branch of some sort
    </Text>
  );
}
