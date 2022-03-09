import React, { useCallback, useMemo } from 'react';
import { map, partition } from 'lodash';
import { useSelector } from 'react-redux';
import { c, t } from 'ttag';

import {
  CUSTOM,
  GUIDED_CAMPAIGNS,
  TDE,
  TDEA,
  TDEB,
  GOB,
  CampaignCycleCode,
  DARK_MATTER,
  ALICE_IN_WONDERLAND,
  CROWN_OF_EGIL,
  CALL_OF_THE_PLAGUEBEARER,
  EOE,
} from '@actions/types';
import CycleItem from './CycleItem';
import { campaignName } from '../constants';
import { getPacksInCollection } from '@reducers';
import CardDetailSectionHeader from '@components/card/CardDetailView/CardDetailSectionHeader';
import { useSettingValue } from '@components/core/hooks';

export interface SelectCampagaignProps {
  campaigns: CampaignCycleCode[];
  campaignChanged: (packCode: CampaignCycleCode, text: string, hasGuide: boolean) => void;
  segment?: boolean;
  includeCustom?: boolean;
}

const authors = {
  [DARK_MATTER]: 'Axolotl',
  [ALICE_IN_WONDERLAND]: 'The Beard',
  [CROWN_OF_EGIL]: 'The Mad Juggler',
  [CALL_OF_THE_PLAGUEBEARER]: 'Walker Graves',
}
function campaignDescription(packCode: CampaignCycleCode): string | undefined {
  switch (packCode) {
    case TDE:
      return t`Campaign A and Campaign B\nEight-part campaign`;
    case TDEA:
      return t`Campaign A\nFour-part campaign`;
    case TDEB:
      return t`Campaign B\nFour-part campaign`;
    case GOB:
      return t`Two-part campaign variant`;
    case DARK_MATTER:
    case ALICE_IN_WONDERLAND:
    case CROWN_OF_EGIL:
    case CALL_OF_THE_PLAGUEBEARER:
      const author = authors[packCode];
      return t`Fan-made campaign by ${author}`;
    default:
      return undefined;
  }
}

export default function CampaignTab({ campaignChanged, campaigns, segment, includeCustom }: SelectCampagaignProps) {
  const in_collection = useSelector(getPacksInCollection);
  const ignore_collection = useSettingValue('ignore_collection');

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
        text={campaignName(packCode) || c('campaign').t`Custom`}
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
      pack_code => (ignore_collection || in_collection[pack_code] || pack_code === 'core' || (
        in_collection.tde && (pack_code === TDEA || pack_code === TDEB || pack_code === TDE) ||
        (in_collection.eoec && pack_code === EOE)))
    );
  }, [segment, campaigns, in_collection, ignore_collection]);
  return (
    <>
      { !!segment && myCampaigns.length > 0 && (
        <CardDetailSectionHeader normalCase color="dark" title={t`My Campaigns` } />
      ) }
      { map(myCampaigns, pack_code => renderCampaign(pack_code)) }
      { includeCustom && renderCampaign(CUSTOM) }
      { !!segment && otherCampaigns.length > 0 && (
        <CardDetailSectionHeader normalCase color="dark" title={t`Other Campaigns`} />
      ) }
      { map(otherCampaigns, pack_code => renderCampaign(pack_code)) }
    </>
  );
}
