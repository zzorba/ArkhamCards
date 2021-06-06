import React, { useCallback, useMemo } from 'react';
import { map, partition } from 'lodash';
import { useSelector } from 'react-redux';
import { t } from 'ttag';

import {
  CUSTOM,
  GUIDED_CAMPAIGNS,
  TDE,
  TDEA,
  TDEB,
  CampaignCycleCode,
  DARK_MATTER,
  ALICE_IN_WONDERLAND,
} from '@actions/types';
import CycleItem from './CycleItem';
import { campaignName } from '../constants';
import { getPacksInCollection } from '@reducers';
import CardSectionHeader from '@components/core/CardSectionHeader';

export interface SelectCampagaignProps {
  campaigns: CampaignCycleCode[];
  campaignChanged: (packCode: CampaignCycleCode, text: string, hasGuide: boolean) => void;
  segment?: boolean;
  includeCustom?: boolean;
}

function campaignDescription(packCode: CampaignCycleCode): string | undefined {
  switch (packCode) {
    case TDE:
      return t`Campaign A and Campaign B\nEight-part campaign`;
    case TDEA:
      return t`Campaign A\nFour-part campaign`;
    case TDEB:
      return t`Campaign B\nFour-part campaign`;
    case DARK_MATTER:
      return t`Fan-made campaign by Axolotl`
    case ALICE_IN_WONDERLAND:
      return t`Fan-made campiagn by The Beard`;
    default:
      return undefined;
  }
}

export default function CampaignTab({ campaignChanged, campaigns, segment, includeCustom }: SelectCampagaignProps) {
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

  const [myCampaigns, otherCampaigns] = useMemo(() => {
    if (!segment) {
      return [campaigns, []];
    }
    return partition(
      campaigns,
      pack_code => (in_collection[pack_code] || (
        in_collection.tde && (pack_code === TDEA || pack_code === TDEB || pack_code === TDE)))
    );
  }, [segment, campaigns, in_collection]);
  return (
    <>
      { !!segment && myCampaigns.length > 0 && (
        <CardSectionHeader section={{ title: t`My Campaigns` }} />
      ) }
      { map(myCampaigns, pack_code => renderCampaign(pack_code)) }
      { includeCustom && renderCampaign(CUSTOM) }
      { !!segment && otherCampaigns.length > 0 && (
        <CardSectionHeader section={{ title: t`Other Campaigns` }} />
      ) }
      { map(otherCampaigns, pack_code => renderCampaign(pack_code)) }
    </>
  );
}
