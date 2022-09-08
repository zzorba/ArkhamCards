import React, { useCallback, useMemo, useState } from 'react';
import { msgid, ngettext, t } from 'ttag';

import { useDialog } from '@components/deck/dialogs';
import { View } from 'react-native';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useGetDeleteInformationLazyQuery } from '@generated/graphql/apollo-schema';
import CardTextComponent from '@components/card/CardTextComponent';
import ArkhamLoadingSpinner from '@components/core/ArkhamLoadingSpinner';
import { forEach, map } from 'lodash';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import NewDialog from '@components/core/NewDialog';
import space from '@styles/space';
import { useDeleteAccount } from '@data/remote/api';

export default function useDeleteAccountDialog(
  user: FirebaseAuthTypes.User | undefined,
  logout: () => Promise<void>
): [() => void, React.ReactNode] {
  const [fetchDeleteInfo, deleteInfo] = useGetDeleteInformationLazyQuery({
    variables: {
      userId: user?.uid || '',
    },
  });

  const [acknowledged, setAcknowledged] = useState(false);
  const actuallyDeleteAccount = useDeleteAccount();

  const [content, canDelete] = useMemo(() => {
    if (deleteInfo.loading || !deleteInfo.data || !deleteInfo.data.users_by_pk) {
      return [(
        <>
          <CardTextComponent text={t`Loading account details...`} />
          <ArkhamLoadingSpinner autoPlay loop />
        </>
      ), false];
    }
    const handle = deleteInfo.data.users_by_pk.handle;
    const createdCampaignCount = deleteInfo.data.users_by_pk.createdCampaignCount.aggregate?.count || 0;
    const joinedCampaignCount = deleteInfo.data.users_by_pk.joinedCampaignCount.aggregate?.count || 0;
    const messages = [
      t`Are you sure that you want to <b>permanently</b> delete your account? This <b>cannot be undone</b>.`,
    ];
    if (handle) {
      messages.push(t`You are currently signed in as <b>${handle}</b>.`);
    }
    if (createdCampaignCount || joinedCampaignCount) {
      messages.push(t`If you choose to delete this account, the following data will be removed.`);
      if (createdCampaignCount) {
        messages.push(
          ngettext(msgid`The campaign that you have uploaded to this account will be deleted:`,
            `The ${createdCampaignCount} campaigns that you have uploaded to this account will be deleted:`,
            createdCampaignCount
          )
        );
        forEach(deleteInfo.data.users_by_pk.createdCampaignCount.nodes, campaign => {
          if (campaign.campaign?.name) {
            messages.push(`- ${campaign.campaign.name}`);
          }
        });
      }
      if (joinedCampaignCount) {
        messages.push(
          ngettext(msgid`The friend's campaign that you have participated in will have your decks removed:`,
            `The ${joinedCampaignCount} campaigns from friends that you have participated in will have your decks removed:`,
            joinedCampaignCount
          )
        );
        forEach(deleteInfo.data.users_by_pk.joinedCampaignCount.nodes, campaign => {
          if (campaign.campaign?.name) {
            messages.push(`- ${campaign.campaign.name}`);
          }
        });
      }
    }
    const campaignCount = joinedCampaignCount + createdCampaignCount;
    return [
      <>
        { map(messages, (text, idx) => <CardTextComponent text={text} key={idx} />) }
        { (campaignCount > 0) && (
          <View style={space.paddingTopS}>
            <NewDialog.ContentLine
              icon="trash"
              text={t`I understand that all data will be deleted permanently.`}
              control={
                <ArkhamSwitch
                  value={acknowledged}
                  onValueChange={setAcknowledged}
                />
              }
            />
          </View>
        ) }
      </>,
      (campaignCount === 0 || acknowledged),
    ];
  }, [deleteInfo, acknowledged, setAcknowledged])

  const onDelete = useCallback(async() => {
    await actuallyDeleteAccount();
    await logout();
    return true;
  }, [actuallyDeleteAccount, logout]);
  const { dialog, showDialog } = useDialog({
    title: t`Confirm account deletion`,
    confirm: {
      title: t`Delete account`,
      color: !canDelete ? 'red_outline' : 'red',
      disabled: !canDelete,
      loading: deleteInfo.loading,
      onPress: onDelete,
    },
    allowDismiss: true,
    content: (
      <View>
        { content }
      </View>
    ),
    forceVerticalButtons: true,
  });

  const showConfirmDelete = useCallback(() => {
    setAcknowledged(false);
    fetchDeleteInfo({
      variables: {
        userId: user?.uid || '',
      },
    });
    setTimeout(() => {
      showDialog()
    }, 1000);
  }, [showDialog, user, fetchDeleteInfo, setAcknowledged]);
  return [showConfirmDelete, dialog];
}
