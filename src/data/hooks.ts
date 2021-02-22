import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { concat, filter, map, sortBy } from 'lodash';

import { AppState, getCampaigns, makeCampaignGuideStateSelector, makeCampaignSelector } from '@reducers';
import { Campaign, CampaignGuideState, CampaignId, SingleCampaign } from '@actions/types';
import { useServerCampaign, useServerCampaignGuideState } from './parse/hooks';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useGetUserHandleQuery } from './graphql/schema';

export function useCampaigns(): [Campaign[], boolean, undefined | (() => void)] {
  const campaigns = useSelector(getCampaigns);
  const [serverCampaigns, loading, refresh] = [[], false, undefined]; // useMyCampaigns();

  const allCampaigns = useMemo(() => {
    return map(sortBy(
      concat(
        filter(campaigns, c => !c.campaign.serverId),
        serverCampaigns
      ), c => c.sort), c => c.campaign);
  }, [campaigns, serverCampaigns]);
  return [allCampaigns, loading, refresh];
}

export function useCampaign(campaignId?: CampaignId): SingleCampaign | undefined {
  const getCampaign = useMemo(makeCampaignSelector, []);
  const reduxCampaign = useSelector((state: AppState) => campaignId ? getCampaign(state, campaignId.campaignId) : undefined);
  const [serverCampaign] = useServerCampaign(campaignId);
  return campaignId?.serverId ? serverCampaign : reduxCampaign;
}

export function useCampaignGuideState(campaignId?: CampaignId): CampaignGuideState | undefined {
  const campaignGuideStateSelector = useMemo(makeCampaignGuideStateSelector, []);
  const reduxCampaignGuideState = useSelector((state: AppState) => campaignId ? campaignGuideStateSelector(state, campaignId.campaignId) : undefined);
  const [serverCampaignGuideState] = useServerCampaignGuideState(campaignId);
  return campaignId?.serverId ? serverCampaignGuideState : reduxCampaignGuideState;
}

export function useCurrentUserHandle(): [string | undefined, boolean] {
  const { user, loading } = useContext(ArkhamCardsAuthContext);

  const { data, loading: loadingProfile } = useGetUserHandleQuery({
    variables: { uid: user?.id || '' },
    skip: !user,
  });
  console.log(data);
  return [data?.publicUser?.handle || undefined, loadingProfile || loading];
}