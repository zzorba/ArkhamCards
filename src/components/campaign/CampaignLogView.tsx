import React, { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { ScrollView, View, StyleSheet } from 'react-native';

import { CampaignId, CampaignNotes } from '@actions/types';
import CampaignLogSection from './CampaignLogSection';
import { useInvestigatorCards } from '@components/core/hooks';
import { useCampaign, useCampaignInvestigators } from '@data/hooks';
import LoadingSpinner from '@components/core/LoadingSpinner';
import StyleContext from '@styles/StyleContext';
import { updateCampaignNotes } from './actions';
import useAddCampaignNoteSectionDialog from './useAddCampaignNoteSectionDialog';
import useTextEditDialog from '@components/core/useTextEditDialog';
import { useCountDialog } from '@components/deck/dialogs';
import { useSetCampaignNotes } from '@data/remote/campaigns';

export interface CampaignLogViewProps {
  campaignId: CampaignId;
}

export default function CampaignLogView({ campaignId }: CampaignLogViewProps) {
  const [addSectionDialog, showAddSectionDialog] = useAddCampaignNoteSectionDialog();
  const [dialog, showTextEditDialog] = useTextEditDialog();
  const [countDialog, showCountDialog] = useCountDialog();
  const { backgroundStyle } = useContext(StyleContext);
  const campaign = useCampaign(campaignId);
  const dispatch = useDispatch();
  const investigators = useInvestigatorCards();
  const [allInvestigators] = useCampaignInvestigators(campaign, investigators);
  const setCampaignNotes = useSetCampaignNotes();
  const saveCampaignNotes = useCallback((campaignNotes: CampaignNotes) => {
    dispatch(updateCampaignNotes(setCampaignNotes, campaignId, campaignNotes));
  }, [dispatch, setCampaignNotes, campaignId]);

  if (!campaign) {
    return <LoadingSpinner />;
  }
  return (
    <View style={styles.flex}>
      <ScrollView contentContainerStyle={backgroundStyle}>
        <CampaignLogSection
          campaignNotes={campaign.campaignNotes}
          allInvestigators={allInvestigators}
          updateCampaignNotes={saveCampaignNotes}
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
