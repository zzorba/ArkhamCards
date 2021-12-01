import React, { useContext, useMemo } from 'react';
import { filter, map } from 'lodash';
import { t } from 'ttag';

import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import { PartnerStatusEffect } from '@data/scenario/types';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';

interface Props {
  effect: PartnerStatusEffect;
  input?: string[];
}

export default function PartnerStatusEffectComponent({ effect, input }: Props) {
  const { campaignGuide } = useContext(CampaignGuideContext);
  const sectionName = campaignGuide.logSection(effect.section)?.section || t`Expedition Team`;
  const partners = useMemo(() => {
    const codes = new Set(effect.partner === '$fixed_partner' && effect.fixed_partner ? [effect.fixed_partner] : (input || []));
    const allPartners = campaignGuide.campaignLogPartners(effect.section);
    return filter(allPartners, p => codes.has(p.code));
  }, [campaignGuide, effect, input]);

  const messages: {
    [status: string]: undefined | {
      add?: (partnerName: string) => string,
      remove?: (partnerName: string) => string,
    },
  } = useMemo(() => {
    return {
      eliminated: {
        add: (partnerName: string) => t`In the ${sectionName} section of the Campaign Log, cross out ${partnerName},`,
      },
      mia: {
        add: (partnerName: string) => t`In the ${sectionName} section of the Campaign Log, write \"MIA\" next to ${partnerName}.`,
        remove: (partnerName: string) => t`In the ${sectionName} section of the Campaign Log, cross out \"MIA\" next to ${partnerName}.`,
      },
      resolute: {
        add: (partnerName: string) => t`In the ${sectionName} section of the Campaign Log, draw a check mark next to ${partnerName}.`,
      },
    };
  }, [sectionName]);
  const message = messages[effect.status];
  if (!message) {
    return null;
  }
  const theMessage = message[effect.operation];
  if (!theMessage) {
    return null;
  }
  return (
    <>
      { map(partners, p => (
        <SetupStepWrapper bulletType={effect.bullet_type} key={p.code}>
          <CampaignGuideTextComponent text={theMessage(p.name)} />
        </SetupStepWrapper>
      ))}
    </>
  );
}