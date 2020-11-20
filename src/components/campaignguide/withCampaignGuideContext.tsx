import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import CampaignGuideContext, { CampaignGuideContextType } from '@components/campaignguide/CampaignGuideContext';
import { useCampaignGuideReduxData } from '@components/campaignguide/contextHelper';
import useCampaignGuideContext from './useCampaignGuideContext';
import { useInvestigatorCards } from '@components/core/hooks';
import LoadingSpinner from '@components/core/LoadingSpinner';

export interface CampaignGuideInputProps {
  campaignId: number;
}

export interface CampaignGuideProps {
  campaignData: CampaignGuideContextType;
}

export default function withCampaignGuideContext<Props>(
  WrappedComponent: React.ComponentType<Props & CampaignGuideProps>
): React.ComponentType<Props & CampaignGuideInputProps> {
  function CampaignDataComponent(props: Props & CampaignGuideInputProps) {
    const { campaignId } = props;
    const investigators = useInvestigatorCards();
    const campaignData = useCampaignGuideReduxData(campaignId, investigators);
    const context = useCampaignGuideContext(campaignId, campaignData);
    if (!campaignData || !context) {
      return (
        <LoadingSpinner />
      );
    }
    return (
      <CampaignGuideContext.Provider value={context}>
        <WrappedComponent
          {...props as Props}
          campaignData={context}
        />
      </CampaignGuideContext.Provider>
    );
  }
  hoistNonReactStatic(CampaignDataComponent, WrappedComponent);
  return CampaignDataComponent;
}
