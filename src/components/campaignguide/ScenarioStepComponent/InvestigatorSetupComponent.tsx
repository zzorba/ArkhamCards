import React, { useMemo, useContext } from 'react';
import { find, forEach, keys, map } from 'lodash';
import { t } from 'ttag';

import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import { InvestigatorSetupStep } from '@data/scenario/types';
import SetupStepWrapper from '../SetupStepWrapper';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { useInvestigators } from '@components/core/hooks';
import ArkhamLoadingSpinner from '@components/core/ArkhamLoadingSpinner';
import { stringList } from '@lib/stringHelper';
import LanguageContext from '@lib/i18n/LanguageContext';

interface Props {
  step: InvestigatorSetupStep;
  campaignLog: GuidedCampaignLog;
}

function ScarletKeysSetup({ campaignLog }: { campaignLog: GuidedCampaignLog }) {
  const { listSeperator } = useContext(LanguageContext);
  const [investigatorCodes, investigatorKeys] = useMemo(() => {
    const keySection = find(campaignLog.campaignGuide.campaignLogSections(), section => section.type === 'scarlet_keys')?.scarlet_keys || [];
    const keysByGator: { [code: string]: string[] | undefined } = {};
    forEach(keySection, key => {
      const status = campaignLog.campaignData.scarlet.keyStatus[key.id];
      if (status?.investigator && !status.enemy) {
        keysByGator[status.investigator] = [
          ...(keysByGator[status.investigator] || []),
          key.name,
        ];
      }
    });
    return [keys(keysByGator), keysByGator];
  }, [campaignLog.campaignData.scarlet.keyStatus, campaignLog.campaignGuide]);
  const investigators = useInvestigators(investigatorCodes);
  return (
    <>
      <SetupStepWrapper>
        <CampaignGuideTextComponent
          text={t`Each investigator who is the bearer of 1 or more key attaches those keys to their investigator card:`}
        />
      </SetupStepWrapper>
      { investigators ?
        map(investigators, investigator => {
          if (!investigator) {
            return null;
          }
          return (
            <SetupStepWrapper key={investigator.code} bulletType="small">
              <CampaignGuideTextComponent
                text={`${investigator.name}: ${stringList(investigatorKeys[investigator.code] || [], listSeperator)}`}
              />
            </SetupStepWrapper>
          );
        }) : <ArkhamLoadingSpinner autoPlay loop />}
    </>
  );
}

export default function InvestigatorSetupComponent({ step, campaignLog }: Props) {
  return (
    <>
      { map(step.sections, (section, idx) => {
        switch (section) {
          case 'scarlet_keys':
            return (
              <ScarletKeysSetup key={idx} campaignLog={campaignLog} />
            );
          default:
            return null;
        }
      })}
      { !!step.text && (
        <SetupStepWrapper>
          <CampaignGuideTextComponent text={step.text} />
        </SetupStepWrapper>
      ) }
    </>
  );
}
