import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { t } from 'ttag';

import CampaignGuideContext, { CampaignGuideContextType } from '@components/campaignguide/CampaignGuideContext';
import { SingleCampaignGuideStatus, useSingleCampaignGuideData } from '@components/campaignguide/contextHelper';
import useCampaignGuideContextFromActions from './useCampaignGuideContextFromActions';
import { useInvestigatorCards } from '@components/core/hooks';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { CampaignId } from '@actions/types';
import { useCampaignId } from '@components/campaign/hooks';
import { useUpdateCampaignActions } from '@data/remote/campaigns';
import { useDeckActions } from '@data/remote/decks';
import CampaignErrorView from './CampaignErrorView';

export interface CampaignGuideInputProps {
  campaignId: CampaignId;
}

export interface InjectedCampaignGuideContextProps {
  setCampaignServerId: (serverId: number) => void;
}

export function useCampaignGuideContext(oCampaignId: CampaignId, live: boolean): [
  CampaignGuideContextType | undefined,
  SingleCampaignGuideStatus | undefined,
  (serverId: number) => void,
  boolean
] {
  const [campaignId, setCampaignServerId, uploadingCampaign] = useCampaignId(oCampaignId);
  const investigators = useInvestigatorCards();
  const [campaignData, campaignGuideStatus] = useSingleCampaignGuideData(campaignId, investigators, live);
  const updateCampaignActions = useUpdateCampaignActions();
  const deckActions = useDeckActions();
  const context = useCampaignGuideContextFromActions(campaignId, deckActions, updateCampaignActions, campaignData);
  return [context, campaignGuideStatus, setCampaignServerId, uploadingCampaign && !context];
}

export default function withCampaignGuideContext<Props>(
  WrappedComponent: React.ComponentType<Props & InjectedCampaignGuideContextProps>,
  { rootView }: { rootView: boolean }
): React.ComponentType<Props & CampaignGuideInputProps> {
  function CampaignDataComponent(props: Props & CampaignGuideInputProps) {
    const [context, campaignGuideStatus, setCampaignServerId, uploading] = useCampaignGuideContext(props.campaignId, rootView);
    if (!context) {
      if (campaignGuideStatus === 'update') {
        return <CampaignErrorView message={t`An app update is required to access this campaign.`} />;
      }
      return (
        <LoadingSpinner large message={uploading ? t`Uploading campaign` : undefined} />
      );
    }
    return (
      <CampaignGuideContext.Provider value={context}>
        <WrappedComponent {...props as Props} setCampaignServerId={setCampaignServerId} />
      </CampaignGuideContext.Provider>
    );
  }

  hoistNonReactStatic(CampaignDataComponent, WrappedComponent);
  return CampaignDataComponent;
}
