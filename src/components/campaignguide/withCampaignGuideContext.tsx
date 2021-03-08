import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import { useCampaignGuideReduxData, useLiveCampaignGuideReduxData } from '@components/campaignguide/contextHelper';
import useCampaignGuideContext from './useCampaignGuideContext';
import { useInvestigatorCards } from '@components/core/hooks';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { CampaignId } from '@actions/types';
import { useCampaignId } from '@components/campaign/hooks';
import { useUpdateCampaignActions } from '@data/remote/campaigns';
import { useCreateDeckActions } from '@data/remote/decks';

export interface CampaignGuideInputProps {
  campaignId: CampaignId;
}

export interface InjectedCampaignGuideContextProps {
  setCampaignServerId: (serverId: number) => void;
}

export default function withCampaignGuideContext<Props>(
  WrappedComponent: React.ComponentType<Props & InjectedCampaignGuideContextProps>,
  { rootView }: { rootView: boolean }
): React.ComponentType<Props & CampaignGuideInputProps> {
  function LiveCampaignDataComponent(props: Props & CampaignGuideInputProps) {
    const [campaignId, setCampaignServerId] = useCampaignId(props.campaignId);
    const investigators = useInvestigatorCards();
    const campaignData = useLiveCampaignGuideReduxData(campaignId, investigators);
    const updateCampaignActions = useUpdateCampaignActions();
    const createDeckActions = useCreateDeckActions();
    const context = useCampaignGuideContext(campaignId, createDeckActions, updateCampaignActions, campaignData);
    if (!campaignData || !context) {
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
  function CampaignDataComponent(props: Props & CampaignGuideInputProps) {
    const [campaignId, setCampaignServerId] = useCampaignId(props.campaignId);
    const investigators = useInvestigatorCards();
    const campaignData = useCampaignGuideReduxData(campaignId, investigators);
    const updateCampaignActions = useUpdateCampaignActions();
    const createDeckActions = useCreateDeckActions();
    const context = useCampaignGuideContext(campaignId, createDeckActions, updateCampaignActions, campaignData);
    if (!campaignData || !context) {
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
  if (rootView) {
    hoistNonReactStatic(LiveCampaignDataComponent, WrappedComponent);
    return LiveCampaignDataComponent;
  }

  hoistNonReactStatic(CampaignDataComponent, WrappedComponent);
  return CampaignDataComponent;
}
