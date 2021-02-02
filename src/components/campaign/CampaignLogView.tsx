import React, { useCallback, useContext, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ScrollView, View, StyleSheet } from 'react-native';

import { CampaignId, CampaignNotes } from '@actions/types';
import CampaignLogSection from './CampaignLogSection';
import { useCampaign, useCampaignDetails, useInvestigatorCards } from '@components/core/hooks';
import LoadingSpinner from '@components/core/LoadingSpinner';
import withDialogs, { ShowTextEditDialog } from '@components/core/withDialogs';
import StyleContext from '@styles/StyleContext';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { updateCampaign } from './actions';
import AddCampaignNoteSectionDialog, { AddSectionFunction } from './AddCampaignNoteSectionDialog';

export interface CampaignLogViewProps {
  campaignId: CampaignId;
}

interface Props extends CampaignLogViewProps {
  showTextEditDialog: ShowTextEditDialog;
}
function CampaignLogView({ campaignId, showTextEditDialog }: Props) {
  const { backgroundStyle } = useContext(StyleContext);
  const { user } = useContext(ArkhamCardsAuthContext);
  const campaign = useCampaign(campaignId);
  const dispatch = useDispatch();
  const investigators = useInvestigatorCards();
  const [, allInvestigators] = useCampaignDetails(campaign, investigators);
  const updateCampaignNotes = useCallback((campaignNotes: CampaignNotes) => {
    dispatch(updateCampaign(user, campaignId, { campaignNotes }));
  }, [dispatch, campaignId, user]);
  const addSectionCallback = useRef<AddSectionFunction>();
  const [addSectionVisible, setAddSectionVisible] = useState(false);

  const showAddSectionDialog = useCallback((addSectionFunction: AddSectionFunction) => {
    addSectionCallback.current = addSectionFunction;
    setAddSectionVisible(true);
  }, [addSectionCallback, setAddSectionVisible]);
  const hideAddSectionDialog = useCallback(() => {
    setAddSectionVisible(false);
    addSectionCallback.current = undefined;
  }, [addSectionCallback, setAddSectionVisible]);

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
          showAddSectionDialog={showAddSectionDialog}
        />
      </ScrollView>
      <AddCampaignNoteSectionDialog
        visible={addSectionVisible}
        addSection={addSectionCallback.current}
        hide={hideAddSectionDialog}
      />
    </View>
  );
}
export default withDialogs(CampaignLogView);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
