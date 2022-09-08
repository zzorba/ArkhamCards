import React, { useMemo } from 'react';
import { View } from 'react-native';
import { t } from 'ttag';

import HealthSanityIcon from '@components/core/HealthSanityIcon';
import { useCounter } from '@components/core/hooks';
import InputCounterRow from '../InputCounterRow';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import Card from '@data/types/Card';
import space from '@styles/space';
import { NumberChoices } from '@actions/types';

interface Props {
  physicalAdjust: number;
  incPhysical: () => void;
  decPhysical: () => void;

  mentalAdjust: number;
  decMental: () => void;
  incMental: () => void;
  editable: boolean;
  saving: boolean;
  campaignLog: GuidedCampaignLog;
  investigator: Card;
  choices: NumberChoices | undefined;
}

export default function useTraumaSection({
  physicalAdjust,
  incPhysical,
  decPhysical,
  mentalAdjust,
  incMental,
  decMental,
  campaignLog, investigator, saving, choices, editable }: Props) {

  const physicalTrauma: number = useMemo(() => {
    if (choices === undefined) {
      if (!editable) {
        return 0;
      }
      return physicalAdjust;
    }
    return (choices.physical && choices.physical[0]) || 0;
  }, [choices, physicalAdjust, editable]);

  const mentalTrauma: number = useMemo(() => {
    if (choices === undefined) {
      if (!editable) {
        return 0;
      }
      return mentalAdjust;
    }
    return (choices.mental && choices.mental[0]) || 0;
  }, [choices, mentalAdjust, editable]);
  const [health, sanity] = useMemo(() => {
    const traumaAndCardData = campaignLog.traumaAndCardData(investigator.code);
    return [investigator.getHealth(traumaAndCardData), investigator.getSanity(traumaAndCardData)];
  }, [campaignLog, investigator]);
  const baseTrauma = useMemo(() => campaignLog.baseTrauma(investigator.code), [campaignLog, investigator]);
  const traumaDelta = useMemo(() => campaignLog.traumaChanges(investigator.code), [campaignLog, investigator]);

  return useMemo(() => {
    const physical = (traumaDelta.physical || 0) + physicalTrauma;
    const mental = (traumaDelta.mental || 0) + mentalTrauma;
    const totalPhysical = (baseTrauma.physical || 0) + physical;
    const totalMental = (baseTrauma.mental || 0) + mental;
    const locked = (choices !== undefined) || !editable;
    return (
      <>
        <InputCounterRow
          editable={!locked}
          bottomBorder
          disabled={saving}
          icon={<View style={{ paddingLeft: 2, paddingRight: 1 }}><HealthSanityIcon type="health" size={24} /></View>}
          title={t`Physical`}
          count={physical}
          total={totalPhysical}
          inc={incPhysical}
          dec={decPhysical}
          max={health}
        />
        <InputCounterRow
          editable={!locked}
          disabled={saving}
          icon={<View style={space.paddingRightXs}><HealthSanityIcon type="sanity" size={20} /></View>}
          title={t`Mental`}
          count={mental}
          total={totalMental}
          inc={incMental}
          dec={decMental}
          max={sanity}
        />
      </>
    );
  }, [incMental, decMental, incPhysical, decPhysical, editable, saving,
    health, sanity, baseTrauma, choices, physicalTrauma, mentalTrauma, traumaDelta]);


}