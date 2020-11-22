import React, { useCallback } from 'react';
import { map, partition } from 'lodash';
import { useSelector } from 'react-redux';
import { t } from 'ttag';

import {
  CUSTOM,
  ALL_CAMPAIGNS,
  GUIDED_CAMPAIGNS,
  TDE,
  TDEA,
  TDEB,
  CampaignCycleCode,
} from '@actions/types';
import CycleItem from './CycleItem';
import { campaignName } from '../constants';
import { getPacksInCollection } from '@reducers';
import CardSectionHeader from '@components/core/CardSectionHeader';

export interface SelectCampagaignProps {
  campaignChanged: (packCode: CampaignCycleCode, text: string, hasGuide: boolean) => void;
}

function campaignDescription(packCode: CampaignCycleCode): string | undefined {
  switch (packCode) {
    case TDE:
      return t`Campaign A and Campaign B\nEight-part campaign`;
    case TDEA:
      return t`Campaign A\nFour-part campaign`;
    case TDEB:
      return t`Campaign B\nFour-part campaign`;
    default:
      return undefined;
  }
}

export default function CampaignTab({ campaignChanged }: SelectCampagaignProps) {
  const in_collection = useSelector(getPacksInCollection);

  const onPress = useCallback((campaignCode: CampaignCycleCode, text: string) => {
    campaignChanged(campaignCode, text, GUIDED_CAMPAIGNS.has(campaignCode));
  }, [campaignChanged]);

  const renderCampaign = useCallback((packCode: CampaignCycleCode) => {
    const guideComingSoon = (packCode !== CUSTOM && !GUIDED_CAMPAIGNS.has(packCode));
    return (
      <CycleItem
        key={packCode}
        packCode={packCode}
        onPress={onPress}
        text={campaignName(packCode) || t`Custom`}
        description={guideComingSoon ? t`Guide not yet available` : campaignDescription(packCode)}
      />
    );
  }, [onPress]);

  const [myCampaigns, otherCampaigns] = partition(
    ALL_CAMPAIGNS,
    pack_code => (in_collection[pack_code] || (
      in_collection.tde && (pack_code === TDEA || pack_code === TDEB || pack_code === TDE)))
  );
  return (
    <>
      { myCampaigns.length > 0 && (
        <CardSectionHeader section={{ title: t`My Campaigns` }} />
      ) }
      { map(myCampaigns, pack_code => renderCampaign(pack_code)) }
      { renderCampaign(CUSTOM) }
      { otherCampaigns.length > 0 && (
        <CardSectionHeader section={{ title: t`Other Campaigns` }} />
      ) }
      { map(otherCampaigns, pack_code => renderCampaign(pack_code)) }
    </>
  );
}
