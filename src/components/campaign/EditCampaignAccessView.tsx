import React, { useCallback } from 'react';
import { Text, ScrollView } from 'react-native';

import { UploadedCampaignId } from '@actions/types';
import { NavigationProps } from '@components/nav/types';
import { useEditCampaignAccessRequest } from '@data/remote/campaigns';

interface Props {
  campaignId: UploadedCampaignId;
}
export default function EditCampaignAccessView({
  campaignId,
}: Props & NavigationProps) {
  const editCampaignAccess = useEditCampaignAccessRequest();
  const addUser = useCallback(async(user: string) => {
    await editCampaignAccess(campaignId, [user], 'grant');
  }, [editCampaignAccess, campaignId]);
  const removeUser = useCallback(async(user: string) => {
    await editCampaignAccess(campaignId, [user], 'revoke');
  }, [editCampaignAccess, campaignId]);
  return (
    <ScrollView>
      <Text>Add some peeople</Text>
    </ScrollView>
  );
}
