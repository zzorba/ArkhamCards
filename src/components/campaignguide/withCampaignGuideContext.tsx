import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import CampaignGuideContext, { CampaignGuideContextType } from '@components/campaignguide/CampaignGuideContext';
import { useSingleCampaignGuideData } from '@components/campaignguide/contextHelper';
import useCampaignGuideContextFromActions from './useCampaignGuideContextFromActions';
import { useInvestigatorCards } from '@components/core/hooks';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { CampaignId } from '@actions/types';
import { useCampaignId } from '@components/campaign/hooks';
import { useUpdateCampaignActions } from '@data/remote/campaigns';
import { useDeckActions } from '@data/remote/decks';

export interface CampaignGuideInputProps {
  campaignId: CampaignId;
}

export interface InjectedCampaignGuideContextProps {
  setCampaignServerId: (serverId: number) => void;
}

export function useCampaignGuideContext(oCampaignId: CampaignId, live: boolean): [CampaignGuideContextType | undefined, (serverId: number) => void] {
  const [campaignId, setCampaignServerId] = useCampaignId(oCampaignId);
  const investigators = useInvestigatorCards();
  const campaignData = useSingleCampaignGuideData(campaignId, investigators, live);
  const updateCampaignActions = useUpdateCampaignActions();
  const deckActions = useDeckActions();
  const context = useCampaignGuideContextFromActions(campaignId, deckActions, updateCampaignActions, campaignData);
  return [context, setCampaignServerId];
}

export default function withCampaignGuideContext<Props>(
  WrappedComponent: React.ComponentType<Props & InjectedCampaignGuideContextProps>,
  { rootView }: { rootView: boolean }
): React.ComponentType<Props & CampaignGuideInputProps> {
  function CampaignDataComponent(props: Props & CampaignGuideInputProps) {
    const [context, setCampaignServerId] = useCampaignGuideContext(props.campaignId, rootView);
    if (!context) {
      return (
        <LoadingSpinner />
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
