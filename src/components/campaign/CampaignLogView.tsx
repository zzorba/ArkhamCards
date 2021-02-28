import React, { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { ScrollView, View, StyleSheet } from 'react-native';

import { CampaignId, CampaignNotes } from '@actions/types';
import CampaignLogSection from './CampaignLogSection';
import { useCampaignDetails, useInvestigatorCards } from '@components/core/hooks';
import { useCampaign } from '@data/remote/hooks';
import LoadingSpinner from '@components/core/LoadingSpinner';
import StyleContext from '@styles/StyleContext';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { updateCampaign } from './actions';
import useAddCampaignNoteSectionDialog from './useAddCampaignNoteSectionDialog';
import useTextEditDialog from '@components/core/useTextEditDialog';
import { useCountDialog } from '@components/deck/dialogs';

export interface CampaignLogViewProps {
  campaignId: CampaignId;
}

export default function CampaignLogView({ campaignId }: CampaignLogViewProps) {
  const [addSectionDialog, showAddSectionDialog] = useAddCampaignNoteSectionDialog();
  const [dialog, showTextEditDialog] = useTextEditDialog();
  const [countDialog, showCountDialog] = useCountDialog();
  const { backgroundStyle } = useContext(StyleContext);
  const { user } = useContext(ArkhamCardsAuthContext);
  const campaign = useCampaign(campaignId);
  const dispatch = useDispatch();
  const investigators = useInvestigatorCards();
  const [, allInvestigators] = useCampaignDetails(campaign, investigators);
  const updateCampaignNotes = useCallback((campaignNotes: CampaignNotes) => {
    dispatch(updateCampaign(user, campaignId, { campaignNotes }));
  }, [dispatch, campaignId, user]);

  if (!campaign) {
    return <LoadingSpinner />;
  }
  return (
    <View style={styles.flex}>
      <ScrollView contentContainerStyle={backgroundStyle}>
        <CampaignLogSection
          campaignNotes={campaign.campaignNotes}
          allInvestigators={allInvestigators}
          updateCampaignNotes={updateCampaignNotes}
          showTextEditDialog={showTextEditDialog}
          showCountDialog={showCountDialog}
          showAddSectionDialog={showAddSectionDialog}
        />
      </ScrollView>
      { addSectionDialog }
      { dialog }
      { countDialog }
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
